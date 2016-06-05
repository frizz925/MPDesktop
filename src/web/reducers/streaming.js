import { SET_STREAMING, SET_STREAMING_VOLUME } from 'actions';
import * as listeners from './listeners';

export default function(state = {}, action) {
    switch (action.type) {
        case SET_STREAMING:
            state.enabled = action.state;
            break;
        case SET_STREAMING_VOLUME:
            state.volume = action.volume;
            break;
        default:
            return state;
    }

    listeners.onStreamingUpdate(state);
    return _.assign({}, state);
}
