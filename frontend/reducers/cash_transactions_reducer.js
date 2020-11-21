import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";

const defaultState = [];
export default (state = defaultState, action) => {
    Object.freeze(state)
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            const newState = [...action.user.cashTransactions];
            newState.forEach(transact => {
                transact.createdAt = new Date(transact.createdAt)
            });
            return newState;
        case LOGOUT_CURRENT_USER:
            return defaultState;
        default:
            return state;
    }
}
