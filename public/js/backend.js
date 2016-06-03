const MPD = require('./src/backend/MPD');
const backend = window.backend = {};
var mpd;

backend.connect = function(host, port, callback) {
    mpd = new MPD();
    mpd.connect(host, port, callback);
};

backend.command = function(command, callback) {
    mpd.sendCommand(command, callback);
};
