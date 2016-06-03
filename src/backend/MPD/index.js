var _ = require('lodash');
var net = require('net');
var Events = require('./events');

/* flag definition */
const FLAG_INIT = "init";
const FLAG_DEFAULT = "default";

module.exports = function() {
    const self = this;
    /* MPD server info */
    const server = {};
    /* queue definition */
    const commandQueue = [];
    /* global variables declaration */
    var client; 
    var flag = FLAG_INIT;
    var buffer = "";

    /* data handler definitions */
    const dataHandler = {
        init: function(buffer) {
            var parts = buffer.match(/OK MPD (\d+)\.(\d+)\.(\d+)/);
            var resp = parts.shift();
            server.version = _.map(parts, function(part) {
                return Number(part);
            });
            flag = FLAG_DEFAULT;
            return buffer.substring(buffer.indexOf(resp) + resp.length);
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
            commandQueue.shift().callback(resp);
            return buffer.substring(buffer.indexOf("OK\r\n") + 4);
        }
    };

    /* callback function definitions */
    function onData(data) {
        buffer += data;
        if (buffer.indexOf("OK") >= 0) {
            buffer = dataHandler[flag](buffer);
        }
    }


    /* public function definitions */
    self.connect = function(host, port, callback) {
        client = new net.Socket();
        client.connect(port, host, callback || function() {
            console.log("Connected");
        });
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
