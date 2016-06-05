import { UPDATE_STATS, INCREMENT_UPTIME, INCREMENT_PLAYTIME } from 'actions';

export default function(state = {}, action) {
    switch (action.type) {
        case UPDATE_STATS:
            _.assign(state, action.stats);
            break;
        case INCREMENT_UPTIME:
            state.uptime++;
            break;
        case INCREMENT_PLAYTIME:
            state.playtime++;
            break;
        default:
            return state;
    }
    return _.assign({}, state);
}
