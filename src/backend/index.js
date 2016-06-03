var mpd = require('./MPD/index');
var backend = {
    mpd
};

if (window) {
    window.backend = backend;
}
module.exports = backend;
