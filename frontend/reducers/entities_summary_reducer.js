import {combineReducers} from "redux";
import cashHistoryReducer from "./cash_history_reducer";

export default combineReducers({
    cashHistory: cashHistoryReducer,
})