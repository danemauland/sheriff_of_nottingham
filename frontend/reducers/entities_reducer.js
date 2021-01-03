import {combineReducers} from "redux";
import cashTransactionsReducer from "./cash_transactions_reducer";
import tradesReducer from "./trades_reducer";
import displayedAssetsReducer from "./displayed_assets_reducer";
import entitiesSummaryReducer from "./entities_summary_reducer";
import marketNewsReducer from "./market_news_reducer";
import assetInformationReducer from "./asset_information_reducer";

export default combineReducers({
    assetInformation: assetInformationReducer,
    trades: tradesReducer,
    cashTransactions: cashTransactionsReducer,
    displayedAssets: displayedAssetsReducer,
    summary: entitiesSummaryReducer,
    marketNews: marketNewsReducer,
})