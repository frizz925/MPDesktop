var _ = require('lodash');
var net = require('net');
var Events = require('./events');

/* flag definition */
const FLAG_INIT = "init";
const FLAG_DEFAULT = "default";

module.exports = function() {
    const self = this;

    /* public attribute definitions */
    self.server = {};

    /* queue definition */
    const commandQueue = [];
    /* global variables declaration */
    var client, initCallback;
    var flag = FLAG_INIT;
    var buffer = "";

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
            var parts = buffer.match(/(.+): (.+)/gi);
            var resp = {};
            _.each(parts, function(part) {
                var parts = part.match(/(.+): (.+)/);
                var key = parts[1];
                var value = parts[2];
                if (!isNaN(value)) value = Number(value);
                resp[key] = value;
            });
            commandQueue.shift().callback(resp, buffer);
            buffer = buffer.substring(buffer.indexOf("OK") + 2);
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
        }
    }

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
        commandQueue.push({
            command, callback
        });
        client.write(command + "\r\n");
        return self;
    };

    self.disconnect = function() {
        client.destroy();
        return self;
    };
}
