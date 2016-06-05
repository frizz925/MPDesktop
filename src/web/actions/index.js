export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const UPDATE_COVER = 'UPDATE_COVER';
export const UPDATE_SONG = 'UPDATE_SONG';
export const UPDATE_PLAYBACK = 'UPDATE_PLAYBACK';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const UPDATE_OUTPUT = 'UPDATE_OUTPUT';
export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const INCREMENT_SEEKER = 'INCREMENT_SEEKER';

function generate(type, name) {
    return (state) => {
        const action = {};
        action.type = type;
        action[name] = state;
        return action;
    };
}

export const updateCover = generate(UPDATE_COVER, 'cover');
export const updatePlayback = generate(UPDATE_PLAYBACK, 'playback');
export const updatePlaylist = generate(UPDATE_PLAYLIST, 'playlist');
export const updateSearch = generate(UPDATE_SEARCH, 'search');
export const updateSettings = generate(UPDATE_SETTINGS, 'settings');
export const updateSong = generate(UPDATE_SONG, 'song');
export const updateStatus = generate(UPDATE_STATUS, 'status');

export const updateOutput = generate(UPDATE_OUTPUT, 'outputs');

export function incrementSeeker() {
    return {
        type: INCREMENT_SEEKER
    };
}
