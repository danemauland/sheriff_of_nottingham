import {
    RECEIVE_CANDLES,
    RECEIVE_DAILY_CANDLES,
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
    RECEIVE_MARKET_NEWS,
} from "../actions/external_api_actions";
var merge = require('lodash.merge');

const defaultState = {
    assetInformation: {
        tickers: new Set(),
        ownershipHistories: {
            times: {},
            numShares: {},
        },
        candlePrices: {
            oneDay: {},
            oneWeek: {},
            oneYear: {},
        },
        candleTimes: {
            oneDay: {},
            oneWeek: {},
            oneYear: {},
        },
        valuations: {
            oneDay: {},
            oneWeek: {},
            oneYear: {},
        },
        historicPrices: {
            oneDayHigh: {},
            oneDayLow: {},
            oneDayOpen: {},
            oneYearHigh: {},
            oneYearLow: {},
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
            newState.assetInformation.tickers.add(action.ticker);
            return newState;
        case RECEIVE_MARKET_NEWS:
            newState = Object.assign({}, state, {marketNews: action.marketNews})
            return newState;
        case RECEIVE_CANDLES:
            let key;
            const ticker = action.ticker;
            newState = merge({}, state);
            switch (action.subtype) {
                case RECEIVE_DAILY_CANDLES:
                    key = "oneDay";
                    break;
                case RECEIVE_WEEKLY_CANDLES:
                    key = "oneWeek";
                    break;
                case RECEIVE_ANNUAL_CANDLES:
                    key = "oneYear";
                    break;        
            }
            let times;
            let prices;
            if (key === "oneYear") {
                times = action.candles.t;
                prices = action.candles.c.map(price => Math.floor(price * 100));
            } else {
                [times, prices] = pullTimesAndPrices(action.candles, action.subtype);
            }
            newState.assetInformation.candlePrices[key][ticker] = prices;
            newState.assetInformation.candleTimes[key][ticker] = times;
            const ownershipTimes = newState.assetInformation.ownershipHistories.times[ticker];
            const ownershipShares = newState.assetInformation.ownershipHistories.numShares[ticker];
            if (ownershipShares) {
                newState.assetInformation.valuations[key][ticker] = calcValuations(
                    times,
                    prices,
                    ownershipTimes,
                    ownershipShares,
                );
            }
            if (key !== "oneWeek") {
                newState.assetInformation.historicPrices[key + "Low"][ticker] = Math.round(Math.min(...action.candles.l)*100);
                newState.assetInformation.historicPrices[key + "High"][ticker] = Math.round(Math.max(...action.candles.h)*100);
                if (key === "oneDay") {
                    newState.assetInformation.historicPrices.oneDayOpen[ticker] = Math.round(action.candles.o[0]*100);
                }
            }
            return newState;
        default:
            return state;
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

const inMarketHours = time => {
    const date = new Date(time * 1000);
    const dst = date.isDSTObserved();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const marketOpenHour = (dst ? 13 : 14);
    if (hours < marketOpenHour || ((hours < (marketOpenHour + 1) && minutes < 30))) {
        return false;
    } else if (hours >= marketOpenHour + 7) {return false};
    return true;
}

const isLastPeriod = (time, type) => {
    const date = new Date(time * 1000);
    const dst = date.isDSTObserved();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const marketCloseHour = (dst ? 20 : 21);
    switch (type) {
        case RECEIVE_DAILY_CANDLES:
            if (hours === marketCloseHour - 1 && minutes === 55) {return true}
            else {return false};
        case RECEIVE_WEEKLY_CANDLES:
            if (hours === marketCloseHour - 1 && minutes === 30) { return true }
            else { return false };
        default:
            break;
    }
}

const pullTimesAndPrices = (candles, type) => {
    const arrs = [[],[]];
    let newTime;
    for(let i = 0; i < candles.t.length; i++ ) {
        if (inMarketHours(candles.t[i])) {
            arrs[0].push(candles.t[i]);
            arrs[1].push(Math.floor(candles.o[i] * 100));
            if (i === candles.t.length - 1) {
                newTime = new Date(candles.t[i] * 1000);
                switch (type) {
                    case RECEIVE_DAILY_CANDLES:
                        if (newTime.getUTCMinutes() + 5 >= 60) {
                            newTime.setUTCHours(newTime.getUTCHours() + 1);
                            newTime.setUTCMinutes((newTime.getUTCMinutes() + 5) % 60);
                        } else {
                            newTime.setUTCMinutes((newTime.getUTCMinutes() + 5));
                        }
                        break;
                    case RECEIVE_WEEKLY_CANDLES:
                        if (newTime.getUTCMinutes() + 30 >= 60) {
                            newTime.setUTCHours(newTime.getUTCHours() + 1);
                            newTime.setUTCMinutes((newTime.getUTCMinutes() + 30) % 60);
                        } else {
                            newTime.setUTCMinutes((newTime.getUTCMinutes() + 30));
                        }
                        break;
                    default:
                        break;
                }
                arrs[0].push(Date.parse(newTime) / 1000);
                arrs[1].push(Math.floor(candles.c[i] * 100));
            } else if (isLastPeriod(candles.t[i], type)) {
                newTime = new Date(candles.t[i] * 1000);
                newTime.setUTCHours(newTime.getUTCHours() + 1)
                newTime.setUTCMinutes(0)
                arrs[0].push(Date.parse(newTime) / 1000);
                arrs[1].push(Math.floor(candles.c[i] * 100));
            }
        }
    }
    return arrs;
}