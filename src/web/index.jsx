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

import reducers from './reducers';
import * as actions from 'actions';

injectTapEventPlugin();

const MPD = window.backend;
const LASTFM_API_KEY = "1dfdaeab9e98333ba63171987cff9352";
const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.blueGrey500,
        primary2Color: Colors.blueGrey700
    }
});

var settings = localStorage.getItem("settings");
if (settings) {
    settings = JSON.parse(settings);
} else {
    settings = {
        host: "localhost",
        port: 6600
    };
}

var mpd;
var initialState = {
    song: {},
    status: {},
    playback: {
        image_url: "",
        current: 0,
        duration: -1
    },
    settings,

    playlist: [],
    outputs: [],
    search: ""
};

const store = createStore(reducers, initialState);

var previousState = {};
store.subscribe(() => {
    var state = store.getState();
    if (previousState.search !== state.search) {
        previousState.search = state.search;
        fetchPlaylist();
    }
});

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
                store.dispatch(actions.updateCover(image_url));
            }
        },
        error: console.error
    });
}

function fetchPlaylist(song) {
    var state = store.getState();
    var command;
    if (_.isEmpty(state.search)) {
        var start = song ? song.Pos - 10 : 0;
        var end = song ? song.Pos + 10 : 20;
        command = "playlistinfo " + start + ":" + end;
    } else {
        command = "playlistsearch any \"" + state.search + "\"";
    }

    mpd.command(command, function(playlist) {
        store.dispatch(actions.updatePlaylist(playlist));
    });
}

function updateStatus() {
    mpd.command("status", (status) => {
        store.dispatch(actions.updateStatus(status));
    });
}

function updateSong() {
    mpd.command("currentsong", (song) => {
        if (_.isEmpty(song)) return;
        var state = store.getState();
        var oldSong = state.song;
        store.dispatch(actions.updateSong(song));

        if (song.Id == oldSong.Id) return;
        fetchPlaylist(song);
        updateCover(song);
    });
}

function updateOutput() {
    mpd.command("outputs", (outputs) => {
        store.dispatch(actions.updateOutput(outputs));
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
    store.dispatch(actions.incrementSeeker());
}, 1000);

