export default (user) => {
    if (!user) return undefined;
    const ownershipHistories = getOwnershipHistories(user.trades);
    const tickers = getTickers(ownershipHistories);
    return {
            session: {
                username: user.username,
            },
            entities: {
                assetInformation: {
                    tickers,
                    ownershipHistories,
                },
                cashTransactions: [...user.cashTransactions],
                trades: [...user.trades],
            }
        }
}

const getOwnershipHistories = initialTrades => {
    const trades = [...initialTrades].sort((a, b) => a.createdAt - b.createdAt);
    const ownershipHistories = {};

    for (let trade of trades) {
        const ticker = trade.ticker;

        if (!ownershipHistories[ticker]) ownershipHistories[ticker] = [[],[]];

        const times = ownershipHistories[trade.ticker][0];
        times.push(trade.createdAt / 1000);

        const numShares = ownershipHistories[trade.ticker][1];
        numShares.push(trade.numShares + (numShares.last() || 0));
    }
    return ownershipHistories;
}

const getTickers = ownershipHistories => {
    const tickers = new Set();
    for (let ticker in ownershipHistories) {
        tickers.add(ticker);
    }
    return tickers;
}