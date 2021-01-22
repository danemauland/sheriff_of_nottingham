import {
    RECEIVE_CANDLES,
    RECEIVE_QUOTE,
    INITIALIZE_ASSET,
    RECEIVE_COMPANY_OVERVIEW,
    RECEIVE_TICKER_DATA,
    RECEIVE_COMPANY_NEWS,
    FLUSH_ASSET,
    RECEIVE_MARKET_NEWS,
    RECEIVE_INTRADAY_PRICES,
    RECEIVE_ONE_DAY_PRICES,
    RECEIVE_DAILY_PRICES,
} from "../actions/external_api_actions";
import {
    LOGOUT_CURRENT_USER
} from "../actions/session_actions";
import {
    defaultState,
    // setTimesAndPrices,
    updateStockValuations,
    updatePortfolioValuations,
    // setIntradayTimesAndPrices,
    // setOneDayTimesAndPrices,
    // setDailyTimesAndPrices,
} from "../util/new_entities_util";
var merge = require('lodash.merge');

export default (state = defaultState, action) => {
    Object.freeze(state);
    let newState, assetInformation, portfolioHistory, times;
    switch (action.type) {
        case RECEIVE_INTRADAY_PRICES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            merge(assetInformation.prices, action.prices);
            Object.assign(times, action.times);
            merge(assetInformation.startPrices, action.startPrices);
            // setIntradayTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case RECEIVE_ONE_DAY_PRICES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            merge(assetInformation.prices, action.prices);
            Object.assign(times, action.times);
            // setOneDayTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case RECEIVE_DAILY_PRICES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            merge(assetInformation.prices, action.prices);
            merge(assetInformation.startPrices, action.startPrices);
            Object.assign(times, action.times);
            // setDailyTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case INITIALIZE_ASSET:
            newState = merge({}, state);
            
            newState.assetInformation.tickers.add(action.ticker);

            return newState;

        case RECEIVE_MARKET_NEWS:
            newState = Object.assign({}, state, {marketNews: action.marketNews})

            return newState;

        case RECEIVE_CANDLES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            setTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                action,
                assetInformation,
                portfolioHistory,
                times
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