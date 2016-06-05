import { combineReducers } from 'redux';

import playback from './playback';
import status from './status';
import stats from './stats';
import streaming from './streaming';

import * as listeners from './listeners';

import { 
    UPDATE_SONG, UPDATE_SETTINGS,
    UPDATE_PLAYLIST, UPDATE_OUTPUT, UPDATE_SEARCH
} from 'actions';

export default function(state, action) {
    state.playback = playback(state.playback, action);
    state.status = status(state.status, action);
    state.stats = stats(state.stats, action);
    state.streaming = streaming(state.streaming, action);

    switch (action.type) {
        case UPDATE_SONG:
            state.song = action.song;
            listeners.onSongUpdate(state);
            break;
        case UPDATE_SETTINGS:
            state.settings = action.settings;
            state.settings.port = Number(state.settings.port);
            listeners.onSettingsUpdate(action.settings);
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

