var _ = require('lodash');
var net = require('net');
var respHandler = require('./responseHandler');

/* flag definition */
const FLAG_INIT = "init";
const FLAG_DEFAULT = "default";

module.exports = function() {
    const self = this;

    /* queue definition */
    const commandQueue = [];
    var currentCommand;

    /* global variables declaration */
    var client, initCallback, updateCallback;
    var idling = false;
    var flag = FLAG_INIT;
    var buffer = "";

    /* public attribute definitions */
    self.server = {};

    /* public function definitions */
    self.connect = function(host, port, callbacks) {
        initCallback = callbacks.init;
        updateCallback = callbacks.update;
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

    self.idle = function() {
        idling = true;
        self.command("idle", function(resp, buffer) {
            idling = false;
            updateCallback(resp, buffer);
        });
        return self;
    };

    self.unidle = function() {
        client.write("noidle\r\n");
    };

    self.command = function(command, callback) {
        var cmd = { command, callback };
        if (idling) self.unidle();
        if (!currentCommand) {
            currentCommand = cmd;
            executeCurrentCommand();
        } else {
            commandQueue.push(cmd);
        }
        return self;
    };

    self.disconnect = function() {
        client.destroy();
        return self;
    };

    /* command queueing function definitions */
    function commandInQueue() {
        //if (currentCommand) throw "Can't send command when there's already an ongoing command!";
        if (currentCommand) return;
        if (commandQueue.length <= 0) {
            if (!idling) self.idle();
            return;
        }
        currentCommand = commandQueue.shift();
        executeCurrentCommand();
    }

    function executeCurrentCommand() {
        if (!currentCommand) throw "No pending command to execute!";
        client.write(currentCommand.command + "\r\n");
    }

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

            buffer = buffer.substring(buffer.indexOf(text) + text.length);
            return buffer;
        },
        default: function(buffer) {
            var command = currentCommand;
            var cmd = command.command.match(/^([a-z]+)/)[1];
            var parts = buffer.match(/(.+): (.+)/gi);
            var handler = respHandler[cmd] || respHandler.default;
            var resp = handler(parts);

            if (command.callback)
                command.callback(resp, buffer);

            buffer = buffer.substring(buffer.indexOf("OK") + 2);
            currentCommand = null;
            return buffer;
        }
    };

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
            commandInQueue();
        }
    }
}
