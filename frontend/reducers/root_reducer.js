import {combineReducers} from "redux";
import sessionReducer from "./session_reducer";
import errorsReducer from "./errors_reducer";
import uiReducer from "./ui_reducer";
// import entitiesReducer from "./entities_reducer";
import newEntitiesReducer from "./new_entities_reducer";

export default combineReducers({
    newEntities: newEntitiesReducer,
    // entities: entitiesReducer,
    session: sessionReducer,
    errors: errorsReducer,
    ui: uiReducer,
})