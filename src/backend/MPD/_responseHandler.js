"use strict";
var _ = require('lodash');

const handlers = {
    default: function(parts) {
        var resp = {};
        _.each(parseResponse(parts), function(part) {
            resp[part.key] = part.value;
        });
        return resp;
    },
    'playlistinfo': function(parts) {
        return arrayParse(parts, "Id");
    },
    'outputs': function(parts) {
        return arrayParse(parts, "outputenabled");
    }
};

handlers.playlistsearch = handlers.playlistinfo;

function arrayParse(parts, endKey) {
    var resp = [];
    var obj = {};
    _.each(parseResponse(parts), function(part) {
        obj[part.key] = part.value;
        if (part.key == endKey) {
            resp.push(obj);
            obj = {};
        }
    });
    return resp;
}

function parseResponse(parts) {
    var arr = [];
    _.each(parts, function(part) {
        var parts = part.match(/(.+): (.+)/);
        var key = parts[1];
        var value = parts[2];
        if (!isNaN(value)) value = Number(value);
        arr.push({ key, value });
    });
    return arr;
}

module.exports = handlers;
