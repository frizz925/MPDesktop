import { combineReducers } from 'redux';
import { normalizeTrackNumber } from 'helpers';
import playback from './playback';

import { 
    UPDATE_SONG, UPDATE_STATUS, UPDATE_SETTINGS, 
    UPDATE_PLAYLIST, UPDATE_OUTPUT, UPDATE_SEARCH
} from 'actions';

export default function(state, action) {
    state.playback = playback(state.playback, action);

    switch (action.type) {
        case UPDATE_SONG:
            var song = action.song;
            state.song = song;
            console.log(song);
            document.title = song.Artist + " - [" + song.Album + " #" + normalizeTrackNumber(song.Track) + "] " + song.Title;
            break;
        case UPDATE_STATUS:
            state.status = action.status;
            break;
        case UPDATE_SETTINGS:
            state.settings = action.settings;
            state.settings.port = Number(state.settings.port);
            // save settings to localStorage
            localStorage.setItem("settings", JSON.stringify(action.settings));
            break;
        case UPDATE_PLAYLIST:
            state.playlist = action.playlist;
            break;
        case UPDATE_OUTPUT:
            state.outputs = action.outputs;
            break;
        case UPDATE_SEARCH:
            state.search = action.search;
            break;
    }

    return _.assign({}, state);
};

