json.username user.username
json.cashTransactions do
    json.array! user.cash_transactions do |transact|
        json.id transact.id
        json.amount transact.amount
        json.createdAt transact.created_at.to_f
    end
end
json.trades do
    json.array! user.trades do |trade|
        json.id trade.id
        json.numShares trade.num_shares
        json.tradePrice trade.trade_price
        json.ticker trade.ticker
        json.createdAt trade.created_at.to_f
    end
end