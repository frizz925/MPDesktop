var assert = require('chai').assert;
var MPD = require('../src/backend/MPD');

const HOST = "localhost";
const PORT = 6600;

describe("MPD Test", function() {
    const client = new MPD();
    var success = false;

    before(function(done) {
        client.connect(HOST, PORT, function() {
            success = true;
            done();
        });
        client.on('error', done);
    });

    it("Connected to server", function() {
        assert(success);
    });
});
