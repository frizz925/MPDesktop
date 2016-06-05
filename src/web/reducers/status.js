import { UPDATE_STATUS, UPDATE_VOLUME } from 'actions';

export default function(state = {}, action) {
    switch (action.type) {
        case UPDATE_STATUS:
            state = action.status;
            break;
        case UPDATE_VOLUME:
            state.volume = action.volume;
            break;
        default:
            return state;
    }
    return _.assign({}, state);
}
