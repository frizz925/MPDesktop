"use strict";
var _ = require('lodash');
var axios = require('axios');
var fsp = require('fs-promise');
var $path = require('path');

const LASTFM_API_KEY = "1dfdaeab9e98333ba63171987cff9352";
const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/";


module.exports = function(settings) {
    var self = this;

    self.fetch = function(song, callback) {
        fetch(song, callback);
    };

    function localFetch(song, callback, next) {
        if (settings.path) {
            var parsed = $path.parse(song.file);
            var songDir = $path.join(settings.path, parsed.dir);

            var execCallback = function(coverPath) {
                fsp.stat(coverPath)
                    .then(function() {
                        coverPath = coverPath.replace(/\\/g, "/");
                        callback(`file://${coverPath}`);
                    })
                    .catch(function() {
                        next(song, callback);
                    });
            };

            fsp.readdir(songDir)
                .then(function(files) {
                    var found = false;

                    _.each(files, function(file) {
                        var parsed = $path.parse(file);
                        if (parsed.ext == ".jpg" && parsed.name.match(/cover/i)) {
                            execCallback($path.join(songDir, file));
                            found = true;
                            return false;
                        }
                    });

                    if (!found) {
                        next(song, callback);
                    }
                })
                .catch(function(err) {
                    console.error(err);
                    next(song, callback);
                });
        } else {
            next(song, callback);
        }
    }

    function serverFetch(song, callback, next) {
        if (settings.cover.enabled) {
            var dir = $path.parse(song.file).dir;
            var host = settings.cover.host || settings.host;
            var path = settings.cover.path || "";
            var port = settings.cover.port || 80;
            var name = settings.cover.name || "Cover.jpg";
            var url = `http://${host}:${port}${path}/${dir}/${name}`;
            axios.get(url)
                .then(function() {
                    callback(url);
                })
                .catch(function() {
                    next(song, callback);
                });
        } else {
            next(song, callback);
        }
    }

    function lastFMFetch(song, callback, next) {
        var params = {
            method: "album.getInfo",
            artist: song.Artist,
            album: song.Album,
            api_key: LASTFM_API_KEY,
            format: "json"
        };

        axios.get(LASTFM_API_URL, { params })
            .then(function(resp) {
                try {
                    var cover = resp.data.album.image[3]["#text"];
                    callback(cover);
                } catch (e) {
                    // do nothing
                }
            })
            .catch(console.error);
    }

    const _fetchers = [
        localFetch, serverFetch, lastFMFetch
    ];

    function fetch(song, callback) {
        fetchNext(_fetchers.slice())(song, callback);
    }

    function fetchNext(fetchers) {
        return function(song, callback) {
            if (fetchers.length >= 1) {
                fetchers.shift()(song, callback, fetchNext(fetchers));
            } else {
                // do nothing
            }
        }
    }
};
