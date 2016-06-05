export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const UPDATE_COVER = 'UPDATE_COVER';
export const UPDATE_SONG = 'UPDATE_SONG';
export const UPDATE_PLAYBACK = 'UPDATE_PLAYBACK';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const UPDATE_OUTPUT = 'UPDATE_OUTPUT';
export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const UPDATE_STATS = 'UPDATE_STATS';

export const UPDATE_VOLUME = 'UPDATE_VOLUME';
export const UPDATE_SEEK = 'UPDATE_SEEK';

export const INCREMENT_SEEKER = 'INCREMENT_SEEKER';
export const INCREMENT_UPTIME = 'INCREMENT_UPTIME';
export const INCREMENT_PLAYTIME = 'INCREMENT_PLAYTIME';

export const SET_STREAMING = 'SET_STREAMING';
export const SET_STREAMING_VOLUME = 'SET_STREAMING_VOLUME';

function generate(type, name) {
    return (state) => {
        const action = {};
        action.type = type;
        if (name !== undefined) action[name] = state;
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
export const updateStats = generate(UPDATE_STATS, 'stats');

export const updateOutput = generate(UPDATE_OUTPUT, 'outputs');

export const updateVolume = generate(UPDATE_VOLUME, 'volume');
export const updateSeek = generate(UPDATE_SEEK, 'seek');

export const incrementSeeker = generate(INCREMENT_SEEKER);
export const incrementUptime = generate(INCREMENT_UPTIME);
export const incrementPlaytime = generate(INCREMENT_PLAYTIME);

export function setStreaming(state) {
    return {
        type: SET_STREAMING,
        state
    };
}

export const setStreamingVolume = generate(SET_STREAMING_VOLUME, 'volume');
