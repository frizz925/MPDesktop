var _ = require('lodash');
var net = require('net');

/* flag definition */
const FLAG_INIT = "init";
const FLAG_DEFAULT = "default";

module.exports = function() {
    const self = this;

    /* queue definition */
    const commandQueue = [];
    var currentCommand;

    /* global variables declaration */
    var client, initCallback;
    var flag = FLAG_INIT;
    var buffer = "";

    /* public attribute definitions */
    self.server = {};

    /* public function definitions */
    self.connect = function(host, port, callback) {
        initCallback = callback;
        client = new net.Socket();
        client.connect(port, host);
        client.on('data', onData);
        client.on('error', console.error);
        client.on('close', function() {
            console.log("Disconnected");
        });
        return self;
    };

    self.on = function(name, callback) {
        client.on(name, callback);
        return self;
    };

    self.sendCommand = function(command, callback) {
        var cmd = { command, callback };
        if (!currentCommand) { // no pending/ongoing command
            currentCommand = cmd;
            // execute right away
            executeCurrentCommand();
        } else { // queue for next command execution
            commandQueue.push(cmd);
        }
        return self;
    };

    self.disconnect = function() {
        client.destroy();
        return self;
    };

    /* command queueing function definitions */
    function sendCommandInQueue() {
        if (currentCommand) throw "Can't send command when there's already an ongoing command!";
        if (commandQueue.length <= 0) return;
        currentCommand = commandQueue.shift();
        executeCurrentCommand();
    }

    function executeCurrentCommand() {
        if (!currentCommand) throw "No pending command to execute!";
        client.write(currentCommand.command + "\r\n");
    }


    /* response handler definitions */
    const respHandler = {
        default: function(parts) {
            var resp = {};
            _.each(parseResponse(parts), function(part) {
                resp[part.key] = part.value;
            });
            return resp;
        },
        'playlistinfo': function(parts) {
            var resp = [];
            var obj = {};
            _.each(parseResponse(parts), function(part) {
                obj[part.key] = part.value;
                if (part.key == "Id") {
                    resp.push(obj);
                    obj = {};
                }
            });
            return resp;
        }
    };

    /* data handler definitions */
    const dataHandler = {
        init: function(buffer) {
            var parts = buffer.match(/OK MPD (\d+)\.(\d+)\.(\d+)/);
            var text = parts.shift();
            var version = _.map(parts, function(part) {
                return Number(part);
            });
            flag = FLAG_DEFAULT;
            self.server.version = version;
            initCallback(version);
            return buffer.substring(buffer.indexOf(text) + text.length);
        },
        default: function(buffer) {
            var command = currentCommand;
            var parts = buffer.match(/(.+): (.+)/gi);
            var handler = respHandler[command.command] || respHandler.default;
            var resp = handler(parts);
            command.callback(resp, buffer);
            
            currentCommand = null;
            sendCommandInQueue();

            buffer = buffer.substring(buffer.indexOf("OK") + 2);
            return buffer;
        }
    };

    /* helper function definitions */
    function parseResponse(parts) {
        var arr = [];
        _.each(parts, function(part) {
            var parts = part.match(/(.+): (.+)/);
            var key = parts[1];
            var value = parts[2];
            if (!isNaN(value)) value = Number(value);
            arr.push({ key, value });
        });
        return arr;
    }

    /* callback function definitions */
    function onData(data) {
        buffer += data;
        if (buffer.indexOf("OK") >= 0) {
            /*
            console.log("======= START =========");
            console.log(buffer);
            console.log("======= FINISH =========");
            */
            buffer = dataHandler[flag](buffer);
        }
    }
}
