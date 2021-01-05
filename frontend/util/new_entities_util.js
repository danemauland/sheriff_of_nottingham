export const defaultState = Object.freeze({
    assetInformation: {
        tickers: new Set(),
        ownershipHistories: {
            times: {},
            numShares: {},
        },
        candlePrices: {
            oneDay: {},
            oneWeek: {},
            oneYear: {},
        },
        candleTimes: {
            oneDay: {},
            oneWeek: {},
            oneYear: {},
        },
        valuations: {
            oneDay: {},
            oneWeek: {},
            oneYear: {},
        },
        historicPrices: {
            oneDayHigh: {},
            oneDayLow: {},
            oneDayOpen: {},
            oneYearHigh: {},
            oneYearLow: {},
        },
        currentPrices: {},
        companyOverviews: {},
        tickerData: {},
        companyNews: {},
        prevVolume: {},
        curVolume: {},
    },
    portfolioHistory: {
        cashTransactions: [],
        cashHistory: {
            times: [],
            balances: [],
        },
        valuationHistory: {
            times: {
                oneDay: [],
                oneWeek: [],
                oneYear: [],
            },
            valuations: {
                oneDay: [],
                oneWeek: [],
                oneYear: [],
            },
        },
        trades: [],
    }
});

export const getCashHistoy = (transactions, trades) => {
    const {times, amounts} = mergeTransactions(transactions, trades);
    const balances = [];
    const cashHistory = {times, balances};
    amounts.forEach((amount, i) => {
        let oldBalance = balances[i - 1];
        if (i === 0) oldBalance = 0;
        balances.push(oldBalance + amount);
    })
    return cashHistory;
}

export const getOwnershipHistories = initialTrades => {
    const trades = [...initialTrades].sort((a, b) => a.createdAt - b.createdAt);
    const ownershipHistories = {times: {}, numShares: {}};

    for (let trade of trades) {
        const ticker = trade.ticker;

        if (!ownershipHistories.times[ticker]) {
            ownershipHistories.times[ticker] = [];
            ownershipHistories.numShares[ticker] = [];
        }

        const times = ownershipHistories.times[ticker];
        times.push(trade.createdAt / 1000);

        const numShares = ownershipHistories.numShares[ticker];
        numShares.push(trade.numShares + (numShares.last() || 0));
    }
    return ownershipHistories;
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