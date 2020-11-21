import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";

const defaultState = [];
export default (state = defaultState, action) => {
    Object.freeze(state)
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            const newState = [...action.user.trades];
            newState.forEach(trade => {
                trade.createdAt = new Date(trade.createdAt)
            });
            return newState;
        case LOGOUT_CURRENT_USER:
            return defaultState;
        default:
            return state;
    }
}
