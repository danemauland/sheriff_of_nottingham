import {combineReducers} from "redux";
import sessionErrorsReducer from "./session_errors_reducer";
import cashTransactionsErrorsReducer from "./cash_transactions_errors_reducer";

export default combineReducers({
    session: sessionErrorsReducer,
    cashTransactions: cashTransactionsErrorsReducer,
})