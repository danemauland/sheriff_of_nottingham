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
    getKey,
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

const updateStockValuations = (action, assetInformation) => {
    const ticker = action.ticker;
    const key = getKey(action.subtype);
    const ownershipHistories = assetInformation.ownershipHistories;
    const ownershipTimes = ownershipHistories.times[ticker];
    const ownershipShares = ownershipHistories.numShares[ticker];
    const candlePrices = assetInformation.candlePrices;
    const candleTimes = assetInformation.candleTimes;
    const prices = candlePrices[key][ticker];
    const times = candleTimes[key][ticker];

    if (ownershipShares) {
        assetInformation.valuations[key][ticker] = calcValuations(
            times,
            prices,
            ownershipTimes,
            ownershipShares,
        );
    }

}

const binarySearch = (arr, tar, type, i = 0, j = arr.length) => {
    if (j - i === 0) {
        if (type === 1) {
            if (tar <= arr[i]) {return i}
            else {return i + 1}
        } else {
            if ( tar >= arr[i]) {return i}
            else {return i - 1}
        }
    }
    if (j - i === 1) {
        if (type === 1) {
            if (tar > arr[i]) {return i + 1}
            else {return i}
        } else {
            if (tar >= arr[i]) {return i}
            else {return i - 1}
        }
    }
    let mid = Math.floor((i + j) / 2);
    if (tar < arr[mid]) { j = mid }
    else if (tar > arr[mid]) {i = mid + 1}
    else {return mid};
    return binarySearch(arr, tar, type, i, j)
}

const calcValuations = (times, prices, ownershipTimes, ownershipShares) => {
    if (ownershipShares.last() === 0 && ownershipTimes.last < times[0]) {
        const zeros = [];
        for(let i = 0; i < times.length; i++) zeros.push(0);
        return zeros; // need to check this, should this really be returning all 0s?
    }

    let pricesPointer = 0;
    let historyPointer = 0;
    const valuations = [];

    if (times[0] > ownershipTimes[0]) {
        historyPointer = binarySearch(ownershipTimes, times[0], -1);
    }
    while (valuations.length < prices.length) {
        if ((historyPointer === 0) && 
            (times[pricesPointer] < ownershipTimes[historyPointer])
        ) {
            valuations.push(0);
            pricesPointer++;
        } else {
            if (times[pricesPointer] >= ownershipTimes[historyPointer]) {
                if (ownershipTimes[historyPointer + 1] && 
                    times[pricesPointer] >= ownershipTimes[historyPointer + 1]) {
                    historyPointer++;
                } else {
                    valuations.push(ownershipShares[historyPointer]
                        * prices[pricesPointer]    
                    )
                    pricesPointer++;
                }
            } else {
                pricesPointer++;
            }
        }

    }
    return valuations;
}