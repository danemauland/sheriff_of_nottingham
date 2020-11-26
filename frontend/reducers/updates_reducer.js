import { RECEIVE_CASH_TRANSACTION } from "../actions/cash_transactions_actions";
import {RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
} from "../actions/external_api_actions";
import { UPDATE_SUMMARY_VALUE_HISTORY } from "../actions/summary_actions";
import {UPDATE_CASH_HISTORY} from "../actions/summary_actions";

const defaultState = {
    cashHistory: false,
    valueHistory: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case RECEIVE_CASH_TRANSACTION:        
            return Object.assign({}, state, {cashHistory: true});
        case RECEIVE_DAILY_CANDLES:
        case RECEIVE_WEEKLY_CANDLES:
        case RECEIVE_ANNUAL_CANDLES:
            return Object.assign({}, state, {valueHistory: true})
        case UPDATE_SUMMARY_VALUE_HISTORY:
            return Object.assign({}, state, {valueHistory: false})
        case UPDATE_CASH_HISTORY:
            return Object.assign({}, state, {
                cashHistory: false,
                valueHistory: true,
            })
        default:
            return state;
    }
}