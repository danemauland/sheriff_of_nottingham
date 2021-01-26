import {combineReducers} from "redux";
import modalReducer from "./modal_reducer";
import valueIncreasedReducer from "./value_increased_reducer";
// import chartSelectedReducer from "./chart_selected_reducer";
// import updatesReducer from "./updates_reducer";
// import loadingReducer from "./loading_reducer";
import apiDebounceStartTimeReducer from "./api_debounce_start_time_reducer.js";
import flashCashReducer from "./cash-flash-reducer";

export default combineReducers({
    modal: modalReducer,
    valueIncreased: valueIncreasedReducer,
    // chartSelected: chartSelectedReducer,
    // updatesNeeded: updatesReducer,
    // loading: loadingReducer,
    apiDebounceStartTime: apiDebounceStartTimeReducer,
    flashCash: flashCashReducer,
})