import {
    RECEIVE_CASH_TRANSACTION,
    REMOVE_CASH_TRANSACTIONS,
} from "../actions/cash_transactions_actions";
import {
    RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
} from "../actions/external_api_actions";
import {
    UPDATE_SUMMARY_VALUE_HISTORY,
    UPDATE_CASH_HISTORY,
} from "../actions/summary_actions";
import {RECEIVE_TRADE} from "../actions/trade_actions";
import { UPDATE_CHART, CHART_UPDATED } from "../actions/chart_selected_actions";

const defaultState = {
    cashHistory: false,
    valueHistory: false,
    chart: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case REMOVE_CASH_TRANSACTIONS:
        case RECEIVE_TRADE:
        case RECEIVE_CASH_TRANSACTION:
            return Object.assign({}, state, {
                cashHistory: true,
                chart: true,
            });
        case UPDATE_CASH_HISTORY:
            return Object.assign({}, state, {
                cashHistory: false,
                valueHistory: true,
            });
        case RECEIVE_DAILY_CANDLES:
        case RECEIVE_WEEKLY_CANDLES:
        case RECEIVE_ANNUAL_CANDLES:
            return Object.assign({}, state, {valueHistory: true});
        case UPDATE_SUMMARY_VALUE_HISTORY:
            return Object.assign({}, state, {
                valueHistory: false,
                chart: true
            });
        case UPDATE_CHART:
            return Object.assign({}, state, { chart: true });
        case CHART_UPDATED:
            return Object.assign({}, state, { chart: false });
        default:
            return state;
    }
}