export const postCashTransaction = cashTransaction => (
    $.ajax({
        method: "POST",
        url: "api/cash_transactions",
        data: {cash_transaction: cashTransaction}
    })
)

export const demolishCashTransactions = () => (
    $.ajax({
        method: "DELETE",
        url: "api/cash_transactions",
    })
)