import { UPDATE_VALUE_INCREASED } from "../actions/value_increased_actions";

const defaultState = true;
export default (state = defaultState, action) => {
    switch (action.type) {
        case UPDATE_VALUE_INCREASED:        
            return action.bool;
        default:
            return state;
    }
}