import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";
import {RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    // RECEIVE_MONTHLY_CANDLES,
    // RECEIVE_THREE_MONTH_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
    RECEIVE_QUOTE,
    INITIALIZE_ASSETS,
} from "../actions/external_api_actions";

const initializeState = initialTrades => {
    const trades = [...initialTrades];
    const newState = {};
    trades.forEach(trade => {
        if (newState[trade.ticker]) {
            newState[trade.ticker].ownershipHistory.times.push(trade.createdAt);
            const lastIndex = newState[trade.ticker].ownershipHistory.numShares.length - 1;
            newState[trade.ticker].ownershipHistory.numShares.push(
                trade.numShares + 
                newState[trade.ticker].ownershipHistory.numShares[lastIndex]);
        } else {
            newState[trade.ticker] = {}; 
            newState[trade.ticker].ownershipHistory = {};
            newState[trade.ticker].ownershipHistory.times = [trade.createdAt];
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
    let pricesPointer;
    let historyPointer;
    if (times[0] > ownershipHistory.times[0]) {
        pricesPointer = 0;
        historyPointer = binarySearch(ownershipHistory.times, times[0], -1)
    }
    while (values.length < prices.length) {

    }
}

const defaultState = {};
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    switch (action.type) {
        case INITIALIZE_ASSETS:
            return initializeState(action.trades);
        case LOGOUT_CURRENT_USER:
            return defaultState;
        case RECEIVE_DAILY_CANDLES:
            newState = {...state};
            newState[action.ticker].times ||= {};
            newState[action.ticker].prices ||= {};
            newState[action.ticker].times.oneDay = action.candles.t;
            newState[action.ticker].prices.oneDay = action.candles.c.map(price => (
                Math.floor(price * 100)
            ));
            return newState;
        case RECEIVE_WEEKLY_CANDLES:
            newState = {...state};
            newState[action.ticker].times ||= {};
            newState[action.ticker].prices ||= {};
            newState[action.ticker].times.oneWeek = action.candles.t;
            newState[action.ticker].prices.oneWeek = action.candles.c.map(price => (
                Math.floor(price * 100)
            ));
            return newState;
        // case RECEIVE_MONTHLY_CANDLES:
        //     newState = { ...state };
        //     newState[action.ticker].oneMonthCandle = action.candles;
        //     return newState;
        // case RECEIVE_THREE_MONTH_CANDLES:
        //     newState = { ...state };
        //     newState[action.ticker].threeMonthCandle = action.candles;
        //     return newState;
        case RECEIVE_ANNUAL_CANDLES:
            newState = {...state};
            newState[action.ticker].times ||= {};
            newState[action.ticker].prices ||= {};
            newState[action.ticker].times.oneYear = action.candles.t;
            newState[action.ticker].prices.oneYear = action.candles.c.map(price => (
                Math.floor(price * 100)
            ));
            return newState;
        case RECEIVE_QUOTE:
            return Object.assign({}, state, {[action.ticker]:
                Object.assign({}, state[action.ticker], {currentPrice: Math.floor(100*action.quote.c)})})
        default:
            return state;
    }
}