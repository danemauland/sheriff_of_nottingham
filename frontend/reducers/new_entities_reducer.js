import {
    RECEIVE_CANDLES,
    RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
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
    pullTimesAndPrices,
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
            const key = getKey(action.subtype);
            const ticker = action.ticker;
            newState = merge({}, state);
            const assetInformation = newState.assetInformation;
            const {
                candleTimes,
                candlePrices,
                historicPrices
            } = assetInformation;
            
            // const [times, prices] = setTimesAndPrices(action, assetInformation)
            setTimesAndPrices(action, assetInformation)

            // candlePrices[key][ticker] = prices;
            // candleTimes[key][ticker] = times;
            
            updateStockValuations(action, assetInformation);
            // const ownershipTimes = ownershipHistories.times[ticker];
            // const ownershipShares = ownershipHistories.numShares[ticker];

            // if (ownershipShares) {
            //     assetInformation.valuations[key][ticker] = calcValuations(
            //         times,
            //         prices,
            //         ownershipTimes,
            //         ownershipShares,
            //     );
            // }

            if (key !== "oneWeek") {
                historicPrices[key + "Low"][ticker] = Math.round(Math.min(...action.candles.l)*100);
                historicPrices[key + "High"][ticker] = Math.round(Math.max(...action.candles.h)*100);
                if (key === "oneDay") {
                    historicPrices.oneDayOpen[ticker] = Math.round(action.candles.o[0]*100);
                }
            }
            const allPrices = Object.values(candlePrices);
            const updateValuationHistory = allPrices.every(prices => {
                return Object.keys(prices).length === action.tickers.size;
            })
            if (updateValuationHistory) {
                const cashHistory = newState.portfolioHistory.cashHistory;
                const valuationHistory = newState.portfolioHistory.valuationHistory;
                Array.from(assetInformation.tickers).forEach(ticker => {
                    for (let key in candleTimes) {
                        if (candleTimes[key][ticker] && (candleTimes[key][ticker].length < valuationHistory.times[key].length || !valuationHistory.times[key].length)) {
                            valuationHistory.times[key] = candleTimes[key][ticker];
                        }
                    }
                })
                let aggPositionValues = calcAggPositionValues(assetInformation, valuationHistory.times);
                valuationHistory.valuations.oneDay = mergeHistories(cashHistory, aggPositionValues.oneDay, valuationHistory.times.oneDay);
                valuationHistory.valuations.oneWeek = mergeHistories(cashHistory, aggPositionValues.oneWeek, valuationHistory.times.oneWeek);
                valuationHistory.valuations.oneYear = mergeHistories(cashHistory, aggPositionValues.oneYear, valuationHistory.times.oneYear);
                valuationHistory.times.oneWeek.push(valuationHistory.times.oneDay.last());
                valuationHistory.times.oneYear.push(valuationHistory.times.oneDay.last());
                valuationHistory.valuations.oneWeek.push(valuationHistory.valuations.oneDay.last());
                valuationHistory.valuations.oneYear.push(valuationHistory.valuations.oneDay.last());
            }
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

const getKey = type => {
    switch (type) {
        case RECEIVE_DAILY_CANDLES:
            return "oneDay";
        case RECEIVE_WEEKLY_CANDLES:
            return "oneWeek";
        case RECEIVE_ANNUAL_CANDLES:
            return "oneYear";
    }
}

const setTimesAndPrices = (
    {subtype, ticker, candles},
    {candlePrices, candleTimes, prevVolume, curVolume}
) => {

    let times;
    let prices;
    const key = getKey(subtype);

    if (key === "oneYear") {
        times = candles.t;
        prices = candles.c.map(price => Math.floor(price * 100));

        prevVolume[ticker] = candles.v[candles.v.length - 2];
        curVolume[ticker] = candles.v.last();
    } else {
        [times, prices] = pullTimesAndPrices(candles, subtype);
    }

    candlePrices[key][ticker] = prices;
    candleTimes[key][ticker] = times;
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

const mergeHistories = (cashHistory, values, times) => {
    let cashPointer = 0;
    let valuesPointer = 0;
    const totals = [];
    const cashTimes = cashHistory.times;
    const cashBalances = cashHistory.balances;
    while (valuesPointer < values.length) {
        if (cashTimes[cashPointer] <= times[valuesPointer]) {
            if (cashTimes[cashPointer + 1] !== undefined && cashTimes[cashPointer + 1] <= times[valuesPointer]) {
                cashPointer++;
            } else {
                totals.push(cashBalances[cashPointer] + values[valuesPointer]);
                valuesPointer++
            }
        } else {
            totals.push(values[valuesPointer]);
            valuesPointer++;
        }
    }
    return totals;
}

const calcAggPositionValues = (assetInformation, times) => {
    const aggValues = {
        oneDay: [],
        oneWeek: [],
        oneYear: [],
    };
    for (let key in times) {
        for(let i = 0; i < times[key].length; i++) {
            aggValues[key].push(0);
            for(let ticker of assetInformation.tickers) {
                if (assetInformation.valuations[key][ticker]) {
                    aggValues[key][aggValues[key].length - 1] += assetInformation.valuations[key][ticker][i];
                }
            }
        }
    }
    return aggValues;
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