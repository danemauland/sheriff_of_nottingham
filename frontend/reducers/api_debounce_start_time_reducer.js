import {
    SET_API_DEBOUNCE_START_TIME,
    REMOVE_API_DEBOUNCE_START_TIME,
} from "../actions/ui_actions";

const defaultState = null;
export default (state = defaultState, action) => {
    Object.freeze(state);
    switch (action.type) {
        case SET_API_DEBOUNCE_START_TIME:
            return action.startTime;
        case REMOVE_API_DEBOUNCE_START_TIME:
            return defaultState;
        default:
            return state;
    }
}