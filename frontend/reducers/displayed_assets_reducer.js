import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
} from "../actions/session_actions.js";
import {RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_MONTHLY_CANDLES,
    RECEIVE_THREE_MONTH_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
    RECEIVE_QUOTE,
} from "../actions/external_api_actions";



const defaultState = {};
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    debugger;
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            const trades = [...action.user.trades];
            const sumSharesCounter = {};
            trades.forEach(trade => {
                if (sumSharesCounter[trade.ticker]) { sumSharesCounter[trade.ticker] += trade.numShares}
                else {sumSharesCounter[trade.ticker] = trade.numShares}
            });
            newState = {}
            Object.keys(sumSharesCounter).forEach(ticker => {
                if (sumSharesCounter[ticker]) { 
                    newState[ticker] = {
                        ticker,
                        numShares: sumSharesCounter[ticker]
                    }
                }
            })
            return newState;
        case LOGOUT_CURRENT_USER:
            return defaultState;
        case RECEIVE_DAILY_CANDLES:
            newState = {...state};
            newState[action.ticker].oneDayCandle = action.candles;
            return newState;
        case RECEIVE_WEEKLY_CANDLES:
            newState = { ...state };
            newState[action.ticker].oneWeekCandle = action.candles;
            return newState;
        case RECEIVE_MONTHLY_CANDLES:
            newState = { ...state };
            newState[action.ticker].oneMonthCandle = action.candles;
            return newState;
        case RECEIVE_THREE_MONTH_CANDLES:
            newState = { ...state };
            newState[action.ticker].threeMonthCandle = action.candles;
            return newState;
        case RECEIVE_ANNUAL_CANDLES:
            newState = { ...state };
            newState[action.ticker].oneYearCandle = action.candles;
            return newState;
        case RECEIVE_QUOTE:
            return Object.assign({}, state, {[action.ticker]:
                Object.assign({}, state[action.ticker], {quote: action.quote})})
        default:
            return state;
    }
}
