import { RECEIVE_CASH_TRANSACTION_ERRORS,
    CLEAR_CASH_TRANSACTION_ERRORS
} from "../actions/cash_transactions_errors_actions";
import { RECEIVE_CASH_TRANSACTION } from "../actions/cash_transactions_actions";

const defaultState = [];

export default (state = [...defaultState], action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_CASH_TRANSACTION:
            return [...defaultState]
        case CLEAR_CASH_TRANSACTION_ERRORS:
            return [...defaultState]
        case RECEIVE_CASH_TRANSACTION:
            return [...action.errors]
        default:
            return state;
    }
}