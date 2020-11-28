import {combineReducers} from "redux";
import cashTransactionsReducer from "./cash_transactions_reducer";
import tradesReducer from "./trades_reducer";
import displayedAssetsReducer from "./displayed_assets_reducer";
import entitiesSummaryReducer from "./entities_summary_reducer";
import allTickersReducer from "./all_tickers_reducer";

export default combineReducers({
    trades: tradesReducer,
    cashTransactions: cashTransactionsReducer,
    displayedAssets: displayedAssetsReducer,
    summary: entitiesSummaryReducer,
    allTickers: allTickersReducer,
})