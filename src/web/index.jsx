import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { createStore } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import 'normalize-css';

import App from './App.jsx';
import Playlist from 'route_components/Playlist.jsx';
import Output from 'route_components/Output.jsx';
import Settings from 'route_components/Settings.jsx';

import actions from './actions';

injectTapEventPlugin();

const MPD = window.backend;
const LASTFM_API_KEY = "1dfdaeab9e98333ba63171987cff9352";
const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/";

const settings = {
    host: "raspberrypi.lan",
    port: 6600
};

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.blueGrey500,
        primary2Color: Colors.blueGrey700
    }
});

const store = createStore(actions, {
    song: {},
    status: {},
    playlist: [],
    playback: {
        image_url: "",
        current: 0,
        duration: -1
    },
    outputs: [],
    settings
});

var mpd;

function updateCover(song) {
    var query = {
        method: "album.getInfo",
        artist: song.Artist,
        album: song.Album,
        api_key: LASTFM_API_KEY,
        format: "json"
    };

    $.ajax({
        url: LASTFM_API_URL + "?" + $.param(query),
        dataType: "json",
        success: (data) => {
            var image_url = "public/images/music-icon-faded.png";
            try {
                image_url = data.album.image[3]["#text"];
            } catch (e) {
                // do nothing lel
            } finally {
                store.dispatch({
                    type: 'UPDATE_COVER',
                    image_url
                });
            }
        },
        error: console.error
    });
}

function fetchPlaylist(song) {
    var start = song ? song.Pos - 10 : 0;
    var end = song ? song.Pos + 10 : 20;
    mpd.command("playlistinfo " + start + ":" + end, function(playlist) {
        store.dispatch({
            type: 'UPDATE_PLAYLIST',
            playlist
        });
    });
}

function updateStatus() {
    mpd.command("status", (status) => {
        store.dispatch({
            type: 'UPDATE_STATUS',
            status
        });
    });
}

function updateSong() {
    mpd.command("currentsong", (song) => {
        if (_.isEmpty(song)) return;
        var state = store.getState();
        var oldSong = state.song;
        store.dispatch({
            type: 'UPDATE_SONG',
            song
        });

        if (song.Id == oldSong.Id) return;
        fetchPlaylist(song);
        updateCover(song);
    });
}

function updateOutput() {
    mpd.command("outputs", (outputs) => {
        store.dispatch({
            type: 'UPDATE_OUTPUT',
            outputs
        });
    });
}

const connectMPD = window.connectMPD = function() {
    console.log("Connecting...");
    var settings = store.getState().settings;
    mpd = window.mpd = new MPD();
    mpd.connected = false;
    mpd.connect(settings.host, settings.port, {
        init: () => {
            console.log("Connected");
            mpd.connected = true;
            fetchPlaylist();
            updateStatus();
            updateSong();
            updateOutput();
        },
        update: (resp) => {
            if (_.isEmpty(resp)) return;
            switch (resp.changed) {
                case "player":
                    updateStatus();
                    updateSong();
                    break;
                case "output":
                    updateStatus();
                    updateOutput();
                    break;
                default:
                    updateStatus();
                    break;
            }
        }
    });
    mpd.on('close', function() {
        console.log("Disconnected");
        mpd.connected = false;
        console.log("Reconnecting in 3 seconds");
        setTimeout(connectMPD, 3000);
    });
}

connectMPD();

render((
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Playlist} />
                    <Route path="/output" component={Output} />
                    <Route path="/settings" component={Settings} />
                </Route>
            </Router>
        </Provider>
    </MuiThemeProvider>
), document.getElementById("root"));

setInterval(() => {
    var state = store.getState();
    if (state.status.state != "play") return;
    store.dispatch({
        type: 'INCREMENT_SEEKER'
    });
}, 1000);

