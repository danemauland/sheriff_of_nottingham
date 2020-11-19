import { RECEIVE_CURRENT_USER } from "../actions/session_actions";
import { RECEIVE_SESSION_ERRORS } from "../actions/session_error_actions";
import { CLEAR_SESSION_ERRORS } from "../actions/session_error_actions";

const defaultSessionErrorsReducer = [];

const sessionErrorsReducer = (state = [...defaultSessionErrorsReducer], action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return [...defaultSessionErrorsReducer]
        case CLEAR_SESSION_ERRORS:
            return [...defaultSessionErrorsReducer]
        case RECEIVE_SESSION_ERRORS:
            return [...action.errors]
        default:
            return state;
    }
}

export default sessionErrorsReducer