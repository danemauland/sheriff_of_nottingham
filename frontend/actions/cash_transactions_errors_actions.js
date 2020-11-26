export const RECEIVE_CASH_TRANSACTION_ERRORS = 'RECEIVE_CASH_TRANSACTION_ERRORS';
export const CLEAR_CASH_TRANSACTION_ERRORS = 'CLEAR_CASH_TRANSACTION_ERRORS';

export const receiveCashTransactionErrors = errors => ({
    type: RECEIVE_CASH_TRANSACTION_ERRORS,
    errors
})

export const clearSessionErrors = () => ({
    type: CLEAR_CASH_TRANSACTION_ERRORS,
})