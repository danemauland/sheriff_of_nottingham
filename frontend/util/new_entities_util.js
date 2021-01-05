import {
    RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    DAILY_RESOLUTION,
    WEEKLY_RESOLUTION,
} from "../actions/external_api_actions";

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
    marketNews: [],
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

export const convertTimestampsToSeconds = obj => {
    for(let ele of obj) {
        ele.createdAt = Math.floor(ele.createdAt / 1000)
    }
}

export const getCashHistoy = (transactions, trades) => {
    const {times, amounts} = mergeTransactions(transactions, trades);
    const balances = [];
    amounts.forEach((amount, i) => {
        let oldBalance = balances[i - 1];
        if (i === 0) oldBalance = 0;
        balances.push(oldBalance + amount);
    })
    return {times, balances};
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
        times.push(trade.createdAt);

        const numShares = ownershipHistories.numShares[ticker];
        numShares.push(trade.numShares + (numShares.last() || 0));
    }
    return ownershipHistories;
}

const mergeTransactions = (cash, trades) => {
    let cashPointer = 0;
    let tradesPointer = 0;
    const times = [];
    const amounts = [];
    const merged = {times, amounts}

    const mergeIn = ({createdAt, amount}) => {
        times.push(createdAt);
        amounts.push(amount)
    }

    const mergeInTrade = ({numShares, tradePrice, createdAt}) => {
        mergeIn({
            createdAt,
            amount: -numShares * tradePrice,
        })
    }

    // merge the two arrays until one is fully iterated through
    while (cashPointer < cash.length && tradesPointer < trades.length) {
        const transaction = cash[cashPointer];
        const trade = trades[tradesPointer];
        if (transaction.createdAt < trade.createdAt) {
            mergeIn(transaction);
            cashPointer++;
        } else {
            mergeInTrade(trade);
            tradesPointer++;
        }
    }

    while (cashPointer < cash.length) {
        mergeIn(cash[cashPointer]);
        cashPointer++;
    }
    while (tradesPointer < trades.length) {
        mergeInTrade(trades[tradesPointer]);
        tradesPointer++
    }
    return merged;
}

const inMarketHours = time => {
    return !(beforeMarketHours(time) || afterMarketHours(time));
}

const beforeMarketHours = time => {
    const date = new Date(time * 1000);
    const minutes = date.getUTCHours() * 60 + date.getUTCMinutes();
    const marketOpenHour = (date.isDSTObserved() ? 13 : 14);
    const marketOpenMinutes = marketOpenHour * 60 + 30;

    return minutes < marketOpenMinutes;
}

const afterMarketHours = time => {
    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const marketCloseHour = getMarketCloseHour(time);

    return hours >= marketCloseHour;
}

const getMarketCloseHour = time => {
    const date = new Date(time * 1000);
    const dst = date.isDSTObserved();
    
    return (dst ? 20 : 21);
}

const isLastPeriod = (time, type) => {
    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const marketCloseHour = getMarketCloseHour(time);

    if (hours !== marketCloseHour - 1) return false;

    let resolution;
    switch (type) {
        case RECEIVE_DAILY_CANDLES:
            resolution = DAILY_RESOLUTION;
            break;

        case RECEIVE_WEEKLY_CANDLES:
            resolution = WEEKLY_RESOLUTION;
            break;
    }

    const minutes = date.getUTCMinutes();
    
    return minutes === (60 - resolution);
}

export const pullTimesAndPrices = (candles, type) => {
    const times = [];
    const prices = [];
    
    for(let i = 0; i < candles.t.length; i++ ) {
        
        if (inMarketHours(candles.t[i])) {
            times.push(candles.t[i]);
            prices.push(convertToCents(candles.o[i]));
            
            // times/prices are based on the opening times/prices of each
            // candle. The below code adds the closing time/price
            if (i === candles.t.length - 1) {
                const secondsSinceEpoch = Date.parse(new Date()) / 1000
                times.push(secondsSinceEpoch);
                prices.push(convertToCents(candles.c[i]));
            } else if (isLastPeriod(candles.t[i], type)) {
                // converts time to milliseconds since epoch
                // then uses that to construct date object
                let newTime = new Date(candles.t[i] * 1000);

                // sets time to market close
                newTime.setUTCHours(newTime.getUTCHours() + 1);
                newTime.setUTCMinutes(0);

                // converts back to seconds since epoch
                times.push(Date.parse(newTime) / 1000);

                prices.push(convertToCents(candles.c[i]));
            }
        }

        
    }
    return [times, prices];
}

const convertToCents = n => {
    return Math.floor(n * 100)
}