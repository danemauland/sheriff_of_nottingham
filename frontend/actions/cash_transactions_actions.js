import * as cashTransactionsAPIUtil from "../util/cash_transactions_api_util";
import {receiveCashTransactionErrors} from "./cash_transactions_errors_actions";

export const RECEIVE_CASH_TRANSACTION = 'RECEIVE_CASH_TRANSACTION';

const receiveCashTransaction = transaction => ({
    type: RECEIVE_CASH_TRANSACTION,
    transaction,
})

export const postCashTransaction = transaction => dispatch => {
    cashTransactionsAPIUtil.postCashTransaction(transaction).then(
        transaction => dispatch(receiveCashTransaction(transaction)),
        errors => dispatch(receiveCashTransactionErrors(errors.responseJSON))
    )
}