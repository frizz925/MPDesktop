var _ = require('lodash');
var net = require('net');
var Events = require('./events');

/* MPD server info */
const server = {};

/* flag definition */
const FLAG_INIT = "init";
const FLAG_DEFAULT = "default";

/* data handler definition */
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

/* queue definition */
const commandQueue = [];

var flag = FLAG_INIT;
var buffer = "";

function onData(data) {
    buffer += data;
    if (buffer.indexOf("OK") >= 0) {
        buffer = dataHandler[flag](buffer);
    }
}

function sendCommand(command, callback) {
    commandQueue.push({
        command, callback
    });
    client.write(command + "\r\n");
}

const client = new net.Socket();


module.exports = {
    init: function(host, port, callback) {
        client.connect(port, host, function() {
            console.log("Connected");
        });
        client.on('data', onData);
        client.on('error', console.error);
        client.on('close', function() {
            console.log("Disconnected");
        });
    },
    sendCommand
}
