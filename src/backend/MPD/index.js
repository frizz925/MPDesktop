"use strict";
var _ = require('lodash');
var net = require('net');
var respHandler = require('./_responseHandler');
var CoverFetcher = require('./_coverFetcher');

/* flag definition */
const FLAG_INIT = "init";
const FLAG_DEFAULT = "default";

module.exports = function() {
    const self = this;

    /* queue definition */
    const _commandQueue = [];
    var _currentCommand;

    /* global variables declaration */
    var _settings, _initCallback, _updateCallback;
    var _coverFetcher;
    var _idling = false;
    var _flag = FLAG_INIT;
    var _buffer = "";
    var _socketListeners = {};

    /* public attribute definitions */
    self.server = {};
    self.connected = false;

    /* public function definitions */
    self.init = function(settings) {
        _settings = settings;
        _coverFetcher = new CoverFetcher(settings);
    };

    self.connect = function(callbacks) {
        _initCallback = callbacks.init;
        _updateCallback = callbacks.update;

        self.socket = new net.Socket();
        self.socket.connect(_settings.port, _settings.host, function() {
            self.connected = true;
            console.log("Connected");
            callbacks.connect && callbacks.connect();
        });
        self.socket.on('data', function(data) {
            onData(data);
            self.emit('error', data);
        });
        self.socket.on('error', function(err) {
            self.connected = false;
            console.error(err);
            self.emit('error', err);
        });
        self.socket.on('close', function() {
            self.connected = false;
            console.log("Disconnected");
            self.emit('close');
        });

        return self;
    };

    self.on = function(name, callback) {
        self.socket.on(name, callback);
        return self;
    };

    self.emit = function(name, args) {
        var listener = _socketListeners[name];
        listener && listener.apply(self, arguments.slice(1));
    };

    self.write = function(text) {
        self.socket.write(text);
        return self;
    };

    self.idle = function() {
        _idling = true;
        self.command("idle", function(resp, buffer) {
            _idling = false;
            _updateCallback(resp, buffer);
        });
        return self;
    };

    self.unidle = function() {
        self.write("noidle\r\n");
        return self;
    };

    self.command = function(command, callback) {
        var cmd = { command, callback };
        if (_idling) self.unidle();
        if (!_currentCommand) {
            _currentCommand = cmd;
            executeCurrentCommand();
        } else {
            _commandQueue.push(cmd);
        }
        return self;
    };

    self.disconnect = function() {
        self.socket.destroy();
        return self;
    };

    /* module-dependent functions */
    self.fetchCover = function(song, callback) {
        _coverFetcher.fetch(song, callback);
        return self;
    };

    /* command queueing function definitions */
    function commandInQueue() {
        //if (currentCommand) throw "Can't send command when there's already an ongoing command!";
        if (_currentCommand) return;
        if (_commandQueue.length <= 0) {
            if (!_idling) self.idle();
            return;
        }
        _currentCommand = _commandQueue.shift();
        executeCurrentCommand();
    }

    function executeCurrentCommand() {
        //if (!_currentCommand) throw "No pending command to execute!";
        if (!_currentCommand) return;
        self.write(_currentCommand.command + "\r\n");
    }

    /* data handler definitions */
    const dataHandler = {
        init: function(buffer) {
            var parts = buffer.match(/OK MPD (\d+)\.(\d+)\.(\d+)/);
            var text = parts.shift();
            var version = _.map(parts, function(part) {
                return Number(part);
            });

            _flag = FLAG_DEFAULT;
            self.server.version = version;

            _buffer = buffer.substring(buffer.indexOf(text) + text.length);
            self.command("stats", function(stats) {
                _.assign(self.server, stats);
                _initCallback(version);
            });

            return _buffer;
        },
        default: function(buffer) {
            var command = _currentCommand;
            var cmd = command.command.match(/^([a-z]+)/)[1];
            var parts = buffer.match(/(.+): (.+)/gi);
            var handler = respHandler[cmd] || respHandler.default;
            var resp = handler(parts);

            _buffer = buffer.substring(buffer.indexOf("OK") + 2);
            _currentCommand = null;
            if (command.callback)
                command.callback(resp, buffer);

            return _buffer;
        }
    };

    /* callback function definitions */
    function onData(data) {
        _buffer += data;
        if (_buffer.indexOf("OK") >= 0) {
            /*
            console.log("======= START =========");
            console.log(_buffer);
            console.log("======= FINISH =========");
            */
            _buffer = dataHandler[_flag](_buffer);
            commandInQueue();
        }
    }
}
