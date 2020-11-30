json.id @trade.id
json.ticker @trade.ticker
json.createdAt @trade.created_at.to_f * 1000
json.numShares @trade.num_shares
json.tradePrice @trade.trade_price