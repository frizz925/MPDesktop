var assert = require('chai').assert;
var MPD = require('../src/backend/MPD');

const host = "raspberrypi.lan";
const port = 6600;

function commandAndPrint(mpd, cmd, done) {
    mpd.command(cmd, function(resp) {
        console.log(resp);
        done();
    });
}

describe("MPD Test", function() {
    const mpd = new MPD();
    var success = false;

    before(function(done) {
        mpd.init({ host, port });
        mpd.connect({
            init: function(version) {
                success = true;
                console.log(version);
                done();
            },
            update: function(resp, buffer) {
                console.log("IDLE");
            }
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
        /*
        mpd.sendCommand("playlistinfo", function(playlist, buffer) {
            console.log(buffer);
            done();
        });
        */
       commandAndPrint(mpd, "playlistinfo 0:10", done);
    });

    it("Play a song", function(done) {
        commandAndPrint(mpd, "play", done);
    });

    it("Receive current song", function(done) {
        commandAndPrint(mpd, "currentsong", done);
    });
});
