import {
    RECEIVE_CASH_TRANSACTION,
    REMOVE_CASH_TRANSACTIONS,
} from "../actions/cash_transactions_actions";
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
        case UPDATE_CHART:
            return Object.assign({}, state, { chart: true });
        case CHART_UPDATED:
            return Object.assign({}, state, { chart: false });
        default:
            return state;
    }
}