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
    RECEIVE_CEO,
    RECEIVE_IPO_DATE,
    RECEIVE_ABOUT_ITEMS,
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
    newDefaultAboutItems,
} from "../util/new_entities_util";
var merge = require('lodash.merge');

export default (state = defaultState, action) => {
    Object.freeze(state);
    let newState, assetInformation, portfolioHistory, times;
    switch (action.type) {
        case RECEIVE_ABOUT_ITEMS:
            const ticker = action.ticker;
            newState = merge({}, state);
            newState.assetInformation.aboutItems[ticker] ||= newDefaultAboutItems();
            const aboutItems = newState.assetInformation.aboutItems[ticker];
            for(let item of action.items) {
                if (item[0] === "High Today") {
                    aboutItems.set("52 Week High", Math.max(item[1], aboutItems.get("52 Week High") ?? -Infinity));
                } else if (item[0] === "Low Today") {
                    aboutItems.set("52 Week Low", Math.min(item[1], aboutItems.get("52 Week Low") ?? Infinity));
                } else if (item[0] === "52 Week High" && aboutItems.get("High Today")) {
                    item[1] = Math.max(item[1], aboutItems.get("High Today"));
                }  else if (item[0] === "52 Week Low" && aboutItems.get("Low Today")) {
                    item[1] = Math.min(item[1], aboutItems.get("Low Today"));
                }
                newState.assetInformation.aboutItems[ticker].set(item[0], item[1]);
            }
            return newState;

        case RECEIVE_IPO_DATE:
            newState = merge({}, state);
            newState.assetInformation.ipoDates[action.ticker] = action.ipoDate;
            return newState;

        case RECEIVE_CEO:
            newState = merge({}, state);
            newState.assetInformation.ceos[action.ticker] = action.ceo;
            return newState;

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