import {INITIALIZE_ASSETS} from "../actions/external_api_actions.js";
import {LOGOUT_CURRENT_USER} from "../actions/session_actions.js";
import {UPDATE_CASH_HISTORY} from "../actions/summary_actions";

const mergeTransactions = (cash, trades) => {
    let cashPointer = 0;
    let tradesPointer = 0;
    const merged = {times: [], amounts: []};
    while (cashPointer < cash.length && tradesPointer < trades.length) {
        if (cash[cashPointer].createdAt < trades[tradesPointer].createdAt) {
            merged.times.push(cash[cashPointer].createdAt / 1000);
            merged.amounts.push(cash[cashPointer].amount);
            cashPointer++;
        } else {
            let amount = -trades[tradesPointer].numShares * trades[tradesPointer].tradePrice;
            merged.times.push(trades[tradesPointer].createdAt / 1000);
            merged.amounts.push(amount);
            tradesPointer++
        }
    }
    while (cashPointer < cash.length) {
        merged.times.push(cash[cashPointer].createdAt / 1000);
        merged.amounts.push(cash[cashPointer].amount);
        cashPointer++;
    }
    while (tradesPointer < trades.length) {
        let amount = -trades[tradesPointer].numShares * trades[tradesPointer].tradePrice;
        merged.times.push(trades[tradesPointer].createdAt / 1000);
        merged.amounts.push(amount);
        tradesPointer++
    }
    return merged;
}

const defaultState = {times: [], balances: []};
export default (state = defaultState, action) => {
    Object.freeze(state)
    switch (action.type) {
        case UPDATE_CASH_HISTORY:
        case INITIALIZE_ASSETS:
            const sortedCashTransactions = [...action.cashTransactions].sort((a, b) => a.createdAt - b.createdAt);
            const sortedTrades = [...action.trades].sort((a, b) => a.createdAt - b.createdAt)
            const merged = mergeTransactions(sortedCashTransactions, sortedTrades)
            const newState = {times: [...merged.times], balances: []};

            merged.amounts.forEach((amount, i) => {
                let oldBalance = newState.balances[i - 1];
                if (i === 0) oldBalance = 0;
                newState.balances.push(oldBalance + amount);
            })
            return newState;
        case LOGOUT_CURRENT_USER:
            return defaultState;
        default:
            return state;
    }
}
