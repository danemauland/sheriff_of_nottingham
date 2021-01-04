import {RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
    RECEIVE_QUOTE,
    INITIALIZE_ASSETS,
    INITIALIZE_ASSET,
    dstAdjustment,
    RECEIVE_COMPANY_OVERVIEW,
    RECEIVE_TICKER_DATA,
    RECEIVE_COMPANY_NEWS,
    FLUSH_ASSET,
} from "../actions/external_api_actions";
var merge = require('lodash.merge');

const defaultState = {
    assetInformation: {
        tickers: new Set(),
        ownershipHistories: {
            times: {},
            numShares: {},
        },
    },
    portfolioHistory: {
        cashTransactions: [],
        cashHistory: {
            times: [],
            balances: [],
        },
        trades: [],
    }
};
export default (state = defaultState, action) => {
    Object.freeze(state);
    let newState;
    switch (action.type) {
        case INITIALIZE_ASSET:
            newState = merge({}, state);
            newState.tickers.add(action.ticker);
        default:
            return state;
    }
}