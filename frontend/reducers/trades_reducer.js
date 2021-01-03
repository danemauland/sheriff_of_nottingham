import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";
import {
    RECEIVE_TRADE,
    DEMOLISH_TRADES,
} from "../actions/trade_actions";
import {INITIALIZE_ASSETS} from "../actions/external_api_actions"

const defaultState = [];
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            newState = [...action.user.trades].sort((a, b) => a.createdAt - b.createdAt);
            return newState;
        case INITIALIZE_ASSETS:
            newState = [...action.trades].sort((a, b) => a.createdAt - b.createdAt);
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