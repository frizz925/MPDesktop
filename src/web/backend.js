import { createStore } from 'redux';
import * as actions from 'actions';
import reducers from './reducers';

export const MPD = window.backend;

var settings = localStorage.getItem("settings");
if (settings) {
    settings = JSON.parse(settings);
} else {
    settings = {
        host: "localhost",
        port: 6600,
        cover: {
            enabled: false,
            port: 80,
            path: "/cover-art",
            name: "Cover.jpg"
        },
        notification: true,
        streaming: {
            port: 8000
        }
    };
}

const placeholderCover = "public/images/music-icon-faded.png";

var mpd;
var initialState = {
    song: {},
    status: {},
    playback: {
        cover: placeholderCover,
        current: 0,
        duration: -1
    },
    stats: {},
    streaming: {
        enabled: false,
        volume: 1
    },
    settings,

    playlist: [],
    outputs: [],
    search: ""
};
var previousState = _.assign({}, initialState);

export const store = createStore(reducers, initialState);

store.subscribe(() => {
    var state = store.getState();
    if (previousState.search !== state.search) {
        previousState.search = state.search;
        fetchPlaylist();
    }

    var streaming = state.streaming;
    var status = state.status;
    if (status.state == "play") {
        if (streaming.enabled && window.audio.paused) {
            window.audio.play();
        } else if (!streaming.enabled && !window.audio.paused) {
            window.audio.pause();
        }
    } else {
        if (streaming.enabled && !window.audio.paused) {
            window.audio.pause();
        } 
    }
});

function updateCover(song) {
    store.dispatch(actions.updateCover(placeholderCover));
    window.mpd.fetchCover(song, (cover) => {
        store.dispatch(actions.updateCover(cover));
    });
}

function fetchPlaylist(song) {
    var state = store.getState();
    var command;
    if (_.isEmpty(state.search)) {
        song = song || state.song;
        var start = song.Pos ? song.Pos - 10 : 0;
        var end = song.Pos ? song.Pos + 10 : 20;
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
        if (previousState.song.Id !== song.Id) {
            fetchPlaylist(song);
        }
        if (previousState.song.Album !== song.Album) {
            updateCover(song);
        }

        store.dispatch(actions.updateSong(song));
        previousState.song = song;
    });
}

function updateOutput() {
    mpd.command("outputs", (outputs) => {
        store.dispatch(actions.updateOutput(outputs));
    });
}

function updateStats(stats) {
    if (stats) {
        store.dispatch(actions.updateStats(stats));
    } else {
        mpd.command("stats", (stats) => {
            updateStats(stats);
        });
    }
}

export const connectMPD = window.connectMPD = function() {
    console.log("Connecting...");
    var settings = store.getState().settings;
    mpd = window.mpd = new MPD();
    mpd.init(settings);
    mpd.connect({
        init: (version) => {
            fetchPlaylist();
            updateStatus();
            updateSong();
            updateOutput();
            updateStats(mpd.server);
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
        console.log("Reconnecting in 3 seconds");
        setTimeout(connectMPD, 3000);
    });
}

export function init() {
    connectMPD();
}
