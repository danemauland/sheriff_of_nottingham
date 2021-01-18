import {
    RECEIVE_CANDLES,
    RECEIVE_QUOTE,
    INITIALIZE_ASSET,
    RECEIVE_COMPANY_OVERVIEW,
    RECEIVE_TICKER_DATA,
    RECEIVE_COMPANY_NEWS,
    FLUSH_ASSET,
    RECEIVE_MARKET_NEWS,
} from "../actions/external_api_actions";
import {
    LOGOUT_CURRENT_USER
} from "../actions/session_actions";
import {
    defaultState,
    setTimesAndPrices,
    updateStockValuations,
    updatePortfolioValuations,
} from "../util/new_entities_util";
var merge = require('lodash.merge');

export default (state = defaultState, action) => {
    Object.freeze(state);
    let newState;
    switch (action.type) {
        case INITIALIZE_ASSET:
            newState = merge({}, state);
            
            newState.assetInformation.tickers.add(action.ticker);

            return newState;

        case RECEIVE_MARKET_NEWS:
            newState = Object.assign({}, state, {marketNews: action.marketNews})

            return newState;

        case RECEIVE_CANDLES:
            newState = merge({}, state);
            const {assetInformation, portfolioHistory} = newState;

            setTimesAndPrices(action, assetInformation);
            updateStockValuations(action, assetInformation);
            updatePortfolioValuations(
                action,
                assetInformation,
                portfolioHistory
            );
            
            return newState;

        case FLUSH_ASSET:
            // TODO: ITERATE THROUGH OTHER AREAS AND REMOVE TICKER
            newState = merge({}, state);
        
            // Needed since merge does not create new set objects
            newState.assetInformation.tickers = new Set(newState.assetInformation.tickers);

            newState.assetInformation.tickers.delete(action.ticker);
            return newState;

        case LOGOUT_CURRENT_USER:
            return defaultState;

        case RECEIVE_QUOTE:
            newState = {...state};

            newState.assetInformation.currentPrices[action.ticker] = Math.floor(100*action.quote.c);

            return newState;

        case RECEIVE_COMPANY_OVERVIEW:
            newState = {...state};

            newState.assetInformation.companyOverviews[action.ticker] = action.companyOverview;

            return newState;

        case RECEIVE_TICKER_DATA:
            newState = {...state};
            
            newState.assetInformation.tickerData[action.ticker] = action.tickerData;

            return newState;

        case RECEIVE_COMPANY_NEWS:
            newState = {...state};

            newState.assetInformation.companyNews[action.ticker] = action.companyNews;

            return newState;

        default:
            return state;
    }
}