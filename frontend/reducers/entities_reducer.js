import {combineReducers} from "redux";
import cashTransactionsReducer from "./cash_transactions_reducer";
import tradesReducer from "./trades_reducer";
import displayedAssetsReducer from "./displayed_assets_reducer";

export default combineReducers({
    trades: tradesReducer,
    cashTransactions: cashTransactionsReducer,
    displayedAssets: displayedAssetsReducer,
})