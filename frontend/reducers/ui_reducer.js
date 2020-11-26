import {combineReducers} from "redux";
import modalReducer from "./modal_reducer";
import valueIncreasedReducer from "./value_increased_reducer";
import chartSelectedReducer from "./chart_selected_reducer";
import updatesReducer from "./updates_reducer";

export default combineReducers({
    modal: modalReducer,
    valueIncreased: valueIncreasedReducer,
    chartSelected: chartSelectedReducer,
    updatesNeeded: updatesReducer,
})