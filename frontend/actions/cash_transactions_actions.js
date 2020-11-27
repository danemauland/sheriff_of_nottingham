import * as cashTransactionsAPIUtil from "../util/cash_transactions_api_util";
import {receiveCashTransactionErrors} from "./cash_transactions_errors_actions";

export const RECEIVE_CASH_TRANSACTION = 'RECEIVE_CASH_TRANSACTION';
export const REMOVE_CASH_TRANSACTIONS = 'REMOVE_CASH_TRANSACTIONS';

const receiveCashTransaction = cashTransaction => ({
    type: RECEIVE_CASH_TRANSACTION,
    cashTransaction,
})

export const postCashTransaction = transaction => dispatch => {
    cashTransactionsAPIUtil.postCashTransaction(transaction).then(
        cashTransaction => dispatch(receiveCashTransaction(cashTransaction)),
        errors => dispatch(receiveCashTransactionErrors(errors.responseJSON))
    )
}

const removeCashTransactions = () => ({
    type: REMOVE_CASH_TRANSACTIONS,
})

export const demolishCashTransactions = () => dispatch => {
    cashTransactionsAPIUtil.demolishCashTransactions().then(
        () => dispatch(removeCashTransactions()),
    )
}