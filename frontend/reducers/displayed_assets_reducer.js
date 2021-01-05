// import {
//     RECEIVE_CURRENT_USER,
//     LOGOUT_CURRENT_USER
// } from "../actions/session_actions.js";
import {
    // RECEIVE_DAILY_CANDLES,
    // RECEIVE_WEEKLY_CANDLES,
    // RECEIVE_ANNUAL_CANDLES,
    // RECEIVE_QUOTE,
    INITIALIZE_ASSETS,
    INITIALIZE_ASSET,
    // dstAdjustment,
    // RECEIVE_COMPANY_OVERVIEW,
    // RECEIVE_TICKER_DATA,
    // RECEIVE_COMPANY_NEWS,
    // FLUSH_ASSET,
} from "../actions/external_api_actions";
// import { UPDATE_SUMMARY_VALUE_HISTORY } from "../actions/summary_actions";
var merge = require('lodash.merge');

const initializeState = initialTrades => {
    const trades = [...initialTrades].sort((a, b) => a.createdAt - b.createdAt);
    const newState = {};
    trades.forEach(trade => {
        if (newState[trade.ticker]) {
            // newState[trade.ticker].ownershipHistory.times.push(trade.createdAt / 1000);
            // const lastIndex = newState[trade.ticker].ownershipHistory.numShares.length - 1;
            // newState[trade.ticker].ownershipHistory.numShares.push(
            //     trade.numShares + 
            //     newState[trade.ticker].ownershipHistory.numShares[lastIndex]);
        } else {
            newState[trade.ticker] = {}; 
            // newState[trade.ticker].ownershipHistory = {};
            // newState[trade.ticker].ownershipHistory.times = [trade.createdAt / 1000];
            // newState[trade.ticker].ownershipHistory.numShares = [trade.numShares];
            newState[trade.ticker].ticker = trade.ticker;
            newState[trade.ticker].prices = {};
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

// const calcValues = (times, prices, ownershipHistory) => {
//     const ownershipTimes = ownershipHistory.times;
//     const ownershipShares = ownershipHistory.numShares;
//     if (ownershipShares.last() === 0 && ownershipTimes.last < times[0]) {
//         const zeros = [];
//         for(let i = 0; i < times.length; i++) zeros.push(0);
//         return zeros; // need to check this, should this really be returning all 0s?
//     }

//     let pricesPointer = 0;
//     let historyPointer = 0;
//     const values = [];

//     if (times[0] > ownershipTimes[0]) {
//         historyPointer = binarySearch(ownershipTimes, times[0], -1);
//     }
//     while (values.length < prices.length) {
//         if ((historyPointer === 0) && 
//             (times[pricesPointer] < ownershipTimes[historyPointer])
//         ) {
//             values.push(0);
//             pricesPointer++;
//         } else {
//             if (times[pricesPointer] >= ownershipTimes[historyPointer]) {
//                 if (ownershipTimes[historyPointer + 1] && 
//                     times[pricesPointer] >= ownershipTimes[historyPointer + 1]) {
//                     historyPointer++;
//                 } else {
//                     values.push(ownershipShares[historyPointer]
//                         * prices[pricesPointer]    
//                     )
//                     pricesPointer++;
//                 }
//             } else {
//                 pricesPointer++;
//             }
//         }

//     }
//     return values;
// }

// const inMarketHours = time => {
//     const date = new Date(time * 1000);
//     const dst = date.isDSTObserved();
//     const hours = date.getUTCHours();
//     const minutes = date.getUTCMinutes();
//     const marketOpenHour = (dst ? 13 : 14);
//     if (hours < marketOpenHour || ((hours < (marketOpenHour + 1) && minutes < 30))) {
//         return false;
//     } else if (hours >= marketOpenHour + 7) {return false};
//     return true;
// }

// const isLastPeriod = (time, type) => {
//     const date = new Date(time * 1000);
//     const dst = date.isDSTObserved();
//     const hours = date.getUTCHours();
//     const minutes = date.getUTCMinutes();
//     const marketCloseHour = (dst ? 20 : 21);
//     switch (type) {
//         case RECEIVE_DAILY_CANDLES:
//             if (hours === marketCloseHour - 1 && minutes === 55) {return true}
//             else {return false};
//         case RECEIVE_WEEKLY_CANDLES:
//             if (hours === marketCloseHour - 1 && minutes === 30) { return true }
//             else { return false };
//         default:
//             break;
//     }
// }

// const pullTimesAndPrices = (candles, type) => {
//     const arrs = [[],[]];
//     let newTime;
//     for(let i = 0; i < candles.t.length; i++ ) {
//         if (inMarketHours(candles.t[i])) {
//             arrs[0].push(candles.t[i]);
//             arrs[1].push(Math.floor(candles.o[i] * 100));
//             if (i === candles.t.length - 1) {
//                 newTime = new Date(candles.t[i] * 1000);
//                 switch (type) {
//                     case RECEIVE_DAILY_CANDLES:
//                         if (newTime.getUTCMinutes() + 5 >= 60) {
//                             newTime.setUTCHours(newTime.getUTCHours() + 1);
//                             newTime.setUTCMinutes((newTime.getUTCMinutes() + 5) % 60);
//                         } else {
//                             newTime.setUTCMinutes((newTime.getUTCMinutes() + 5));
//                         }
//                         break;
//                     case RECEIVE_WEEKLY_CANDLES:
//                         if (newTime.getUTCMinutes() + 30 >= 60) {
//                             newTime.setUTCHours(newTime.getUTCHours() + 1);
//                             newTime.setUTCMinutes((newTime.getUTCMinutes() + 30) % 60);
//                         } else {
//                             newTime.setUTCMinutes((newTime.getUTCMinutes() + 30));
//                         }
//                         break;
//                     default:
//                         break;
//                 }
//                 arrs[0].push(Date.parse(newTime) / 1000);
//                 arrs[1].push(Math.floor(candles.c[i] * 100));
//             } else if (isLastPeriod(candles.t[i], type)) {
//                 newTime = new Date(candles.t[i] * 1000);
//                 newTime.setUTCHours(newTime.getUTCHours() + 1)
//                 newTime.setUTCMinutes(0)
//                 arrs[0].push(Date.parse(newTime) / 1000);
//                 arrs[1].push(Math.floor(candles.c[i] * 100));
//             }
//         }
//     }
//     return arrs;
// }

const defaultState = {};
const defaultAssetState = {
    // times: {},
    // prices: {},
    // valueHistory: {},
};
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    let timesAndPrices;
    const ticker = action.ticker;
    const ownershipHistory = action.ownershipHistory;
    switch (action.type) {
        case INITIALIZE_ASSETS:
            newState = merge({},initializeState(action.trades));
            return newState;
            break;
        case INITIALIZE_ASSET:
            return merge({}, {[ticker]: {ticker: ticker, prices: {}}})
        // case FLUSH_ASSET:
        //     newState = merge({}, state);
        //     delete newState[ticker];
        //     return newState;
        // case LOGOUT_CURRENT_USER:
        //     return defaultState;
        // case RECEIVE_DAILY_CANDLES:
        //     newState = {...state};
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     newState[ticker].ticker ||= ticker;
        //     newState[ticker].times ||= {};
        //     newState[ticker].prices ||= {};
        //     timesAndPrices = pullTimesAndPrices(action.candles, RECEIVE_DAILY_CANDLES);
        //     newState[ticker].times.oneDay = timesAndPrices[0];
        //     newState[ticker].prices.oneDay = timesAndPrices[1];
        //     if (ownershipHistory.numShares.length > 0) {
        //         newState[ticker].valueHistory ||= {};
        //         newState[ticker].valueHistory.oneDay = calcValues(
        //             newState[ticker].times.oneDay,
        //             newState[ticker].prices.oneDay,
        //             ownershipHistory,
        //         );
        //     }
        //     newState[ticker].prices.oneDayHigh = Math.round(Math.max(...action.candles.h)*100);
        //     newState[ticker].prices.oneDayLow = Math.round(Math.min(...action.candles.l)*100);
        //     newState[ticker].prices.open = Math.round(action.candles.o[0]*100);
        //     return merge({},newState);
        // case RECEIVE_WEEKLY_CANDLES:
        //     newState = {...state};
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     newState[ticker].times ||= {};
        //     newState[ticker].prices ||= {};
        //     timesAndPrices = pullTimesAndPrices(action.candles, RECEIVE_WEEKLY_CANDLES);
        //     newState[ticker].times.oneWeek = timesAndPrices[0];
        //     newState[ticker].prices.oneWeek = timesAndPrices[1];
        //     newState[ticker].valueHistory ||= {};
        //     if (ownershipHistory.numShares.length > 0) {
        //         newState[ticker].valueHistory.oneWeek = calcValues(
        //             newState[ticker].times.oneWeek,
        //             newState[ticker].prices.oneWeek,
        //             ownershipHistory,
        //         );
        //     }
        //     return merge({},newState);
        // case RECEIVE_ANNUAL_CANDLES:
        //     newState = {...state};
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     newState[ticker].times ||= {};
        //     newState[ticker].prices ||= {};
        //     newState[ticker].times.oneYear = action.candles.t;
        //     newState[ticker].prices.oneYear = action.candles.c.map(price => (
        //         Math.floor(price * 100)
        //     ));
        //     newState[ticker].valueHistory ||= {};
        //     if (ownershipHistory.numShares.length > 0) {
        //         newState[ticker].valueHistory.oneYear = calcValues(
        //             newState[ticker].times.oneYear,
        //             newState[ticker].prices.oneYear,
        //             ownershipHistory,
        //         );
        //     }
        //     newState[ticker].prevVolume = action.candles.v[action.candles.v.length - 2];
        //     newState[ticker].curVolume = action.candles.v.last();
        //     newState[ticker].prices.oneYearHigh = Math.round(Math.max(...action.candles.h) * 100);
        //     newState[ticker].prices.oneYearLow = Math.round(Math.min(...action.candles.l) * 100);
        //     return merge({},newState);
        // case RECEIVE_QUOTE:
        //     newState = {...state};
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     return (merge({}, newState, {[ticker]:
        //         Object.assign({}, state[ticker], {currentPrice: Math.floor(100*action.quote.c)})})
        //     );
        // case RECEIVE_COMPANY_OVERVIEW:
        //     newState = {...state};
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     return merge({}, newState, {[ticker]:
        //         Object.assign({}, state[ticker], {companyOverview: action.companyOverview})}
        //     );
        // case RECEIVE_COMPANY_OVERVIEW:
        //     newState = {...state};
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     return merge({}, newState, {[ticker]:
        //         Object.assign({}, state[ticker], {companyOverview: action.companyOverview})}
        //     );
        // case RECEIVE_TICKER_DATA:
        //     newState = { ...state };
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     return merge({}, newState, {
        //         [ticker]:
        //         Object.assign({}, state[ticker], { tickerData: action.tickerData })
        //     });
        // case RECEIVE_COMPANY_NEWS:
        //     newState = { ...state };
        //     newState[ticker] ||= merge({}, defaultAssetState);
        //     return merge({}, newState, {
        //         [ticker]:
        //             Object.assign({}, state[ticker], { companyNews: action.companyNews })
        //     });
        default:
            return state;
    }
}