import {IS_LOADING, FINISHED_LOADING} from "../actions/loading_actions";

const defaultState = true;
export default (state = defaultState, action) => {
    switch (action.type) {
        case IS_LOADING:
            return true;
        case FINISHED_LOADING:
            return false;
        default:
            return state;
    }
}