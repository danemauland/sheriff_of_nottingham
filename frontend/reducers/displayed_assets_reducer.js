import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";
import {RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
    RECEIVE_QUOTE,
    INITIALIZE_ASSETS,
    dstAdjustment,
} from "../actions/external_api_actions";
import { UPDATE_SUMMARY_VALUE_HISTORY } from "../actions/summary_actions";

const initializeState = initialTrades => {
    const trades = [...initialTrades];
    const newState = {};
    trades.forEach(trade => {
        if (newState[trade.ticker]) {
            newState[trade.ticker].ownershipHistory.times.push(trade.createdAt / 1000);
            const lastIndex = newState[trade.ticker].ownershipHistory.numShares.length - 1;
            newState[trade.ticker].ownershipHistory.numShares.push(
                trade.numShares + 
                newState[trade.ticker].ownershipHistory.numShares[lastIndex]);
        } else {
            newState[trade.ticker] = {}; 
            newState[trade.ticker].ownershipHistory = {};
            newState[trade.ticker].ownershipHistory.times = [trade.createdAt / 1000];
            newState[trade.ticker].ownershipHistory.numShares = [trade.numShares];
            newState[trade.ticker].ticker = trade.ticker;
    }});
    return newState;
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

const calcValues = (times, prices, ownershipHistory) => {
    if (ownershipHistory.numShares[ownershipHistory.numShares.length - 1] === 0
        && ownershipHistory.times[ownershipHistory.times - 1] < times[0]
    ) {
        const zeros = [];
        for(let i = 0; i < times.length; i++) {zeros.push(0)};
        return zeros;
    }
    let pricesPointer = 0;
    let historyPointer = 0;
    const values = [];
    if (times[0] > ownershipHistory.times[0]) {
        pricesPointer = 0;
        historyPointer = binarySearch(ownershipHistory.times, times[0], -1);
    }
    while (values.length < prices.length) {
        if ((historyPointer === 0) && 
            (times[pricesPointer] < ownershipHistory.times[historyPointer])
        ) {
            values.push(0);
            pricesPointer++;
        } else {
            if (times[pricesPointer] >= ownershipHistory.times[historyPointer]) {
                if (ownershipHistory.times[historyPointer + 1] && 
                    times[pricesPointer] >= ownershipHistory.times[historyPointer + 1]) {
                    historyPointer++;
                } else {
                    values.push(ownershipHistory.numShares[historyPointer]
                        * prices[pricesPointer]    
                    )
                    pricesPointer++;
                }
            } else {
                pricesPointer++;
            }
        }

    }
    return values;
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

const isLastPeriod= (time, type) => {
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
                arrs[1].push(candles.c[i]);
            }
        }
    }
    return arrs;
}

const defaultState = {};
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    let timesAndPrices;
    switch (action.type) {
        case INITIALIZE_ASSETS:
            return initializeState(action.trades);
        case LOGOUT_CURRENT_USER:
            return defaultState;
        case RECEIVE_DAILY_CANDLES:
            newState = {...state};
            newState[action.ticker].times ||= {};
            newState[action.ticker].prices ||= {};
            timesAndPrices = pullTimesAndPrices(action.candles, RECEIVE_DAILY_CANDLES);
            newState[action.ticker].times.oneDay = timesAndPrices[0];
            newState[action.ticker].prices.oneDay = timesAndPrices[1];
            newState[action.ticker].valueHistory ||= {};
            newState[action.ticker].valueHistory.oneDay = calcValues(
                newState[action.ticker].times.oneDay,
                newState[action.ticker].prices.oneDay,
                newState[action.ticker].ownershipHistory
            );
            newState[action.ticker].MATERIAL_CHANGE = true;
            return newState;
        case RECEIVE_WEEKLY_CANDLES:
            newState = {...state};
            newState[action.ticker].times ||= {};
            newState[action.ticker].prices ||= {};
            timesAndPrices = pullTimesAndPrices(action.candles, RECEIVE_WEEKLY_CANDLES);
            newState[action.ticker].times.oneWeek = timesAndPrices[0];
            newState[action.ticker].prices.oneWeek = timesAndPrices[1];
            newState[action.ticker].valueHistory ||= {};
            newState[action.ticker].valueHistory.oneWeek = calcValues(
                newState[action.ticker].times.oneWeek,
                newState[action.ticker].prices.oneWeek,
                newState[action.ticker].ownershipHistory
            );
            newState[action.ticker].MATERIAL_CHANGE = true;
            return newState;
        case RECEIVE_ANNUAL_CANDLES:
            newState = {...state};
            newState[action.ticker].times ||= {};
            newState[action.ticker].prices ||= {};
            newState[action.ticker].times.oneYear = action.candles.t;
            newState[action.ticker].prices.oneYear = action.candles.c.map(price => (
                Math.floor(price * 100)
            ));
            newState[action.ticker].valueHistory ||= {};
            newState[action.ticker].valueHistory.oneYear = calcValues(
                newState[action.ticker].times.oneYear,
                newState[action.ticker].prices.oneYear,
                newState[action.ticker].ownershipHistory
            );
            newState[action.ticker].MATERIAL_CHANGE = true;
            return newState;
        case RECEIVE_QUOTE:
            return Object.assign({}, state, {[action.ticker]:
                Object.assign({}, state[action.ticker], {currentPrice: Math.floor(100*action.quote.c)})})
        case UPDATE_SUMMARY_VALUE_HISTORY:
            newState = {...state};
            Object.keys(newState).forEach(key => newState[key].MATERIAL_CHANGE = false);
            return newState;
        default:
            return state;
    }
}