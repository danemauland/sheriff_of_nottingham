import { UPDATE_SUMMARY_VALUE_HISTORY } from "../actions/summary_actions";
import { LOGOUT_CURRENT_USER } from "../actions/session_actions.js";
var merge = require('lodash.merge');

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

const calcAggPositionValues = (displayedAssets, times) => {
    const aggValues = {
        oneDay: [],
        oneWeek: [],
        oneYear: [],
    };
    times.oneDay.forEach((time, i) => {
        aggValues.oneDay.push(0);
        Object.values(displayedAssets).forEach(asset => {
            if (asset.valueHistory && asset.valueHistory.oneDay) {
                aggValues.oneDay[aggValues.oneDay.length - 1] += asset.valueHistory.oneDay[i];
            }
        })
    })
    times.oneWeek.forEach((time, i) => {
        aggValues.oneWeek.push(0);
        Object.values(displayedAssets).forEach(asset => {
            if (asset.valueHistory && asset.valueHistory.oneWeek) {
                aggValues.oneWeek[aggValues.oneWeek.length - 1] += asset.valueHistory.oneWeek[i];
            }
        })
    })
    times.oneYear.forEach((time, i) => {
        aggValues.oneYear.push(0);
        Object.values(displayedAssets).forEach(asset => {
            if (asset.valueHistory && asset.valueHistory.oneYear) {
                aggValues.oneYear[aggValues.oneYear.length - 1] += asset.valueHistory.oneYear[i];
            }
        })
    })
    return aggValues;
}

const defaultState = { 
    times: {
        oneDay: [],
        oneWeek: [],
        oneYear: [],
    }, 
    values: {
        oneDay: [],
        oneWeek: [],
        oneYear: [],
    },
};

export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    switch (action.type) {
        case UPDATE_SUMMARY_VALUE_HISTORY:
            newState = merge({}, defaultState);
            const displayedAssets = action.displayedAssets;
            const cashHistory = action.cashHistory;
            Object.values(displayedAssets).forEach(asset => {
                if (asset.times && Object.values(asset.times).length === 3) {
                    if ( newState.times.oneDay.length === 0 || 
                        newState.times.oneDay.length > asset.times.oneDay.length ||
                        newState.times.oneWeek.length > asset.times.oneWeek.length ||
                        newState.times.oneYear.length > asset.times.oneYear.length
                    ) {
                        newState.times = merge({},asset.times)
                    }
                }
            })
            let aggPositionValues = calcAggPositionValues(displayedAssets, newState.times);
            newState.values.oneDay = mergeHistories(cashHistory, aggPositionValues.oneDay, newState.times.oneDay);
            newState.values.oneWeek = mergeHistories(cashHistory, aggPositionValues.oneWeek, newState.times.oneWeek);
            newState.values.oneYear = mergeHistories(cashHistory, aggPositionValues.oneYear, newState.times.oneYear);
            newState.times.oneWeek.push(newState.times.oneDay.last());
            newState.times.oneYear.push(newState.times.oneDay.last());
            newState.values.oneWeek.push(newState.values.oneDay.last());
            newState.values.oneYear.push(newState.values.oneDay.last());
            return newState
        case LOGOUT_CURRENT_USER:
            return defaultState;
        default:
            return state;
    }
}
