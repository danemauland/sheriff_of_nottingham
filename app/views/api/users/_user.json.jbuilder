json.user do 
    json.username user.username
    json.cash_transactions do
        user.cash_transactions.each do |transact|
            json.set! transact.id do
                json.amount transact.amount
                json.created_at transact.created_at.to_f * 1000
            end
        end
    end
    json.trades do
        user.trades.each do |trade|
            json.set! trade.id do
                json.set! :id, trade.id
                json.set! :num_shares, trade.num_shares
                json.set! :trade_price, trade.trade_price
                json.set! :ticker, trade.ticker
                json.set! :created_at, trade.created_at.to_f * 1000
            end
        end
    end
end