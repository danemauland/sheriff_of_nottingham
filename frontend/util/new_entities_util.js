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