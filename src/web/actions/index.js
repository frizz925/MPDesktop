module.exports = (state, action) => {
    switch (action.type) {
        case 'UPDATE_STATUS':
            state.status = action.status;
            state.playback.current = action.status.time ? Number(action.status.time.match(/(\d+):/)[1]) : 0;
            break;
        case 'UPDATE_PLAYLIST':
            state.playlist = action.playlist;
            break;
        case 'UPDATE_SETTINGS':
            state.settings = action.settings;
            console.log(state);
            break;
        case 'UPDATE_SONG':
            state.song = action.song;
            state.playback.duration = action.song.Time;
            break;
        case 'UPDATE_PLAYBACK':
            state.playback = action.playback;
            break;
        case 'UPDATE_OUTPUT':
            state.outputs = action.outputs;
            break;
        case 'INCREMENT_SEEKER':
            if (state.playback.current >= state.playback.duration) return state;
            state.playback = _.assign({}, state.playback, {
                current: ++state.playback.current,
            });
            break;
        case 'UPDATE_COVER':
            state.playback = _.assign({}, state.playback, {
                image_url: action.image_url
            });
            break;
        default:
            return state;
    }
    return _.assign({}, state);
};
