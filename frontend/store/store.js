import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "../reducers/root_reducer";
import createPreloadedState from "../util/preloaded_state_util";

export default user => {
    return createStore(rootReducer,
        createPreloadedState(user),
        applyMiddleware(thunk, logger))
}