import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";
import {
    RECEIVE_TRADE,
    DEMOLISH_TRADES,
} from "../actions/trade_actions";

const defaultState = [];
export default (state = defaultState, action) => {
    Object.freeze(state)
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            const newState = [...action.user.trades].sort((a, b) => a.createdAt - b.createdAt);
            return newState;
        case DEMOLISH_TRADES:
        case LOGOUT_CURRENT_USER:
            return defaultState;
        case RECEIVE_TRADE:
            let trades = [...state]
            trades.push(action.trade);
            trades = trades.sort((a, b) => a.createdAt - b.createdAt);
            return trades;
        default:
            return state;
    }
}