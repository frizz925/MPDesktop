var assert = require('chai').assert;
var MPD = require('../src/backend/MPD');

const HOST = "localhost";
const PORT = 6600;

function commandAndPrint(mpd, cmd, done) {
    mpd.sendCommand(cmd, function(resp) {
        //console.log(resp);
        done();
    });
}

describe("MPD Test", function() {
    const mpd = new MPD();
    var success = false;

    before(function(done) {
        mpd.connect(HOST, PORT, function(version) {
            success = true;
            console.log(version);
            done();
        });
        mpd.on('error', done);
    });

    it("Connect to server", function() {
        assert(success);
    });

    it("Receive status", function(done) {
        commandAndPrint(mpd, "status", done);
    });

    it("Receive playlist", function(done) {
        mpd.sendCommand("playlistinfo", function(playlist, buffer) {
            console.log(buffer);
            done();
        });
    });

    it("Play a song", function(done) {
        commandAndPrint(mpd, "play", done);
    });

    it("Receive current song", function(done) {
        commandAndPrint(mpd, "currentsong", done);
    });
});
