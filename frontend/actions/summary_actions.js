export const UPDATE_SUMMARY_VALUE_HISTORY = 'UPDATE_SUMMARY_VALUE_HISTORY';
export const UPDATE_CASH_HISTORY = "UPDATE_CASH_HISTORY";

export const updateCashHistory = state => ({
    type: UPDATE_CASH_HISTORY,
    cashTransactions: state.newEntities.cashTransactions,
    trades: state.entities.trades,
})

export const updateSummaryValueHistory = state => ({
    type: UPDATE_SUMMARY_VALUE_HISTORY,
    displayedAssets: state.entities.displayedAssets,
    cashHistory: state.newEntities.portfolioHistory.cashHistory,

})