export default (user) => {
    if (!user) return undefined;
    const tickers = getTickers(ownershipHistories);
    const trades = [...user.trades].sort((a, b) => a.createdAt - b.createdAt);
    const cashTransactions = [...user.cashTransactions].sort((a, b) => a.createdAt - b.createdAt);
    const ownershipHistories = getOwnershipHistories(trades);
    const cashHistory = getCashHistoy(cashTransactions, trades);
    return {
        session: {
            username: user.username,
        },
        entities: {
            assetInformation: {
                tickers,
                ownershipHistories,
            },
            portfolioHistory: {
                cashTransactions,
                cashHistory,
                trades,
            },
        }
    }
}

const getCashHistoy = (transactions, trades) => {
    const {times, amounts} = mergeTransactions(transactions, trades);
    const balances = [];
    const cashHistory = [times, balances];
    amounts.forEach((amount, i) => {
        let oldBalance = balances[i - 1];
        if (i === 0) oldBalance = 0;
        balances.push(oldBalance + amount);
    })
    return cashHistory;
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

const mergeTransactions = (cash, trades) => {
    let cashPointer = 0;
    let tradesPointer = 0;
    const merged = {times: [], amounts: []};
    while (cashPointer < cash.length && tradesPointer < trades.length) {
        if (cash[cashPointer].createdAt < trades[tradesPointer].createdAt) {
            merged.times.push(cash[cashPointer].createdAt / 1000);
            merged.amounts.push(cash[cashPointer].amount);
            cashPointer++;
        } else {
            let amount = -trades[tradesPointer].numShares * trades[tradesPointer].tradePrice;
            merged.times.push(trades[tradesPointer].createdAt / 1000);
            merged.amounts.push(amount);
            tradesPointer++
        }
    }
    while (cashPointer < cash.length) {
        merged.times.push(cash[cashPointer].createdAt / 1000);
        merged.amounts.push(cash[cashPointer].amount);
        cashPointer++;
    }
    while (tradesPointer < trades.length) {
        let amount = -trades[tradesPointer].numShares * trades[tradesPointer].tradePrice;
        merged.times.push(trades[tradesPointer].createdAt / 1000);
        merged.amounts.push(amount);
        tradesPointer++
    }
    return merged;
}