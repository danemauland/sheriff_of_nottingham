import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";
import { RECEIVE_CASH_TRANSACTION, REMOVE_CASH_TRANSACTIONS } from "../actions/cash_transactions_actions";

const defaultState = [];
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            newState = [...action.user.cashTransactions].sort((a, b) => a.createdAt - b.createdAt)
            return newState;
        case RECEIVE_CASH_TRANSACTION:
            newState = [...state];
            newState.push(action.cashTransaction);
            newState.sort((a, b) => a.createdAt - b.createdAt);
            return newState;
        // case REMOVE_CASH_TRANSACTIONS:
        //     return defaultState;
        case LOGOUT_CURRENT_USER:
            return defaultState;
        default:
            return state;
    }
}
