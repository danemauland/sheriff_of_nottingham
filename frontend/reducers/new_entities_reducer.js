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
        valuationHistory: {
            times: {
                oneDay: [],
                oneWeek: [],
                oneYear: [],
            },
            valuations: {
                oneDay: [],
                oneWeek: [],
                oneYear: [],
            },
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
            const assetInformation = newState.assetInformation;
            const candleTimes = assetInformation.candleTimes;
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
            assetInformation.candlePrices[key][ticker] = prices;
            candleTimes[key][ticker] = times;
            const ownershipTimes = assetInformation.ownershipHistories.times[ticker];
            const ownershipShares = assetInformation.ownershipHistories.numShares[ticker];
            if (ownershipShares) {
                assetInformation.valuations[key][ticker] = calcValuations(
                    times,
                    prices,
                    ownershipTimes,
                    ownershipShares,
                );
            }
            if (key !== "oneWeek") {
                assetInformation.historicPrices[key + "Low"][ticker] = Math.round(Math.min(...action.candles.l)*100);
                assetInformation.historicPrices[key + "High"][ticker] = Math.round(Math.max(...action.candles.h)*100);
                if (key === "oneDay") {
                    assetInformation.historicPrices.oneDayOpen[ticker] = Math.round(action.candles.o[0]*100);
                }
            }
            prices = Object.values(assetInformation.candlePrices);
            const updateValuationHistory = prices.every(price => {
                return Object.keys(price).length === action.tickers.size;
            })
            if (updateValuationHistory) {
                const cashHistory = newState.portfolioHistory.cashHistory;
                const valuationHistory = newState.portfolioHistory.valuationHistory;
                Array.from(assetInformation.tickers).forEach(ticker => {
                    for (let key in candleTimes) {
                        debugger;
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
        default:
            return state;
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
    // times.oneDay.forEach((time, i) => {
    //     aggValues.oneDay.push(0);
    //     Object.values(displayedAssets).forEach(asset => {
    //         if (asset.valueHistory && asset.valueHistory.oneDay) {
    //             aggValues.oneDay[aggValues.oneDay.length - 1] += asset.valueHistory.oneDay[i];
    //         }
    //     })
    // })
    // times.oneWeek.forEach((time, i) => {
    //     aggValues.oneWeek.push(0);
    //     Object.values(displayedAssets).forEach(asset => {
    //         if (asset.valueHistory && asset.valueHistory.oneWeek) {
    //             aggValues.oneWeek[aggValues.oneWeek.length - 1] += asset.valueHistory.oneWeek[i];
    //         }
    //     })
    // })
    // times.oneYear.forEach((time, i) => {
    //     aggValues.oneYear.push(0);
    //     Object.values(displayedAssets).forEach(asset => {
    //         if (asset.valueHistory && asset.valueHistory.oneYear) {
    //             aggValues.oneYear[aggValues.oneYear.length - 1] += asset.valueHistory.oneYear[i];
    //         }
    //     })
    // })
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