import { UPDATE_SUMMARY_VALUE_HISTORY } from "../actions/summary_actions";
import { LOGOUT_CURRENT_USER } from "../actions/session_actions.js";

const mergeHistories = (cashHistory, values, times) => {
    let cashPointer = 0;
    let valuesPointer = 0;
    const totals = [];
    while (valuesPointer < values.length) {
        if (cashHistory.times[cashPointer] < times[valuesPointer]) {
            if (cashHistory.times[cashPointer + 1] && cashHistory.times[cashPointer + 1] < times[valuesPointer]) {
                cashPointer++;
            } else {
                totals.push(cashHistory.balances[cashPointer] + values[valuesPointer]);
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
    let newState = {...defaultState};
    switch (action.type) {
        case UPDATE_SUMMARY_VALUE_HISTORY:
            let breakLoop = false;
            Object.values(action.state.entities.displayedAssets).forEach(asset => {
                if (breakLoop) {}
                else if (asset.times && Object.values(asset.times).length === 3) {
                    breakLoop = true;
                    newState.times = {...asset.times}
                }
            })
            let aggPositionValues = calcAggPositionValues(action.state.entities.displayedAssets, newState.times);
            newState.values.oneDay = mergeHistories(action.state.entities.summary.cashHistory, aggPositionValues.oneDay, newState.times.oneDay);
            newState.values.oneWeek = mergeHistories(action.state.entities.summary.cashHistory, aggPositionValues.oneWeek, newState.times.oneWeek);
            newState.values.oneYear = mergeHistories(action.state.entities.summary.cashHistory, aggPositionValues.oneYear, newState.times.oneYear);
            return newState
        case LOGOUT_CURRENT_USER:
            return defaultState;
        default:
            return state;
    }
}
