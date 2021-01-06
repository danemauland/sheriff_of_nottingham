import {
    RECEIVE_DAILY_CANDLES,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
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

const pullTimesAndPrices = (candles, type) => {
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

export const setTimesAndPrices = (
    {subtype, ticker, candles},
    {candlePrices, candleTimes, prevVolume, curVolume, historicPrices}
) => {

    let times;
    let prices;
    const key = getKey(subtype);

    if (key === "oneYear") {
        times = candles.t;
        prices = candles.c.map(price => Math.floor(price * 100));

        prevVolume[ticker] = candles.v[candles.v.length - 2];
        curVolume[ticker] = candles.v.last();
    } else {
        [times, prices] = pullTimesAndPrices(candles, subtype);
    }

    candlePrices[key][ticker] = prices;
    candleTimes[key][ticker] = times;

    if (key !== "oneWeek") {
        const minPrice = Math.min(...candles.l);
        const maxPrice = Math.max(...candles.h);
        historicPrices[key + "Low"][ticker] = convertToCents(minPrice);
        historicPrices[key + "High"][ticker] = convertToCents(maxPrice);
        if (key === "oneDay") {
            historicPrices.oneDayOpen[ticker] = convertToCents(candles.o[0]);
        }
    }
}

export const getKey = type => {
    switch (type) {
        case RECEIVE_DAILY_CANDLES:
            return "oneDay";
        case RECEIVE_WEEKLY_CANDLES:
            return "oneWeek";
        case RECEIVE_ANNUAL_CANDLES:
            return "oneYear";
    }
}

export const updatePortfolioValuations = (
    {tickers},
    {candlePrices, candleTimes, valuations: assetValuations},
    {cashHistory, valuationHistory}
) => {

    const allPrices = Object.values(candlePrices);

    const needToUpdate = allPrices.every(prices => {
        return Object.keys(prices).length === tickers.size;
    })

    if (!needToUpdate) return;

    const {valuations, times} = valuationHistory;

    tickers.forEach(ticker => {
        for (let key in candleTimes) {
            
            const tickerTimes = candleTimes[key][ticker];
            
            if (!tickerTimes) continue;

            if (tickerTimes.length < times[key].length || !times[key].length) {
                times[key] = tickerTimes;
            }

        }
    })

    let aggPositionValues = calcAggPositionValues(
        {tickers, valuations: assetValuations},
        times
    );

    for (let key in valuations) {
        valuations[key] = mergeHistories(
            cashHistory,
            aggPositionValues[key],
            times[key]
        )
    }

    // update with today's most recent price/valuation
    times.oneWeek.push(times.oneDay.last());
    times.oneYear.push(times.oneDay.last());
    valuations.oneWeek.push(valuations.oneDay.last());
    valuations.oneYear.push(valuations.oneDay.last());
}

const mergeHistories = (
    {times: cashTimes, balances: cashBalances},
    values,
    times
) => {

    let cashPointer = 0;
    let valuesPointer = 0;
    const totals = [];

    while (valuesPointer < values.length) {
        const nextCashIdx = cashPointer + 1
        const atEndOfCash = nextCashIdx === cashTimes.length;

        if (!atEndOfCash && cashTimes[nextCashIdx] <= times[valuesPointer]) {
            cashPointer++;
            continue;
        }

        let amount = values[valuesPointer];
        if (cashTimes[cashPointer] <= times[valuesPointer]) {
            amount += cashBalances[cashPointer];
        }

        totals.push(amount);
        valuesPointer++;
    }

    while (cashPointer < cashTimes.length) {
        totals.push(values.last() + cashBalances[cashPointer]);
        cashPointer++;
    }

    return totals;
}

const calcAggPositionValues = ({tickers, valuations}, times) => {
    const aggValues = {
        oneDay: [],
        oneWeek: [],
        oneYear: [],
    };

    for (let timeFrame in times) {
        calcTimeFrameTotals(
            times[timeFrame],
            valuations[timeFrame],
            aggValues[timeFrame],
            tickers
        );
    }
    return aggValues;
}

const calcTimeFrameTotals = (times, valuations, aggValues, tickers) => {
    for(let i = 0; i < times.length; i++) {
        aggValues.push(0);
        for(let ticker of tickers) {
            if (valuations[ticker]) {
                aggValues[aggValues.length - 1] += valuations[ticker][i];
            }
        }
    }
}

export const updateStockValuations = (
    {ticker, subtype},
    {ownershipHistories, candlePrices, candleTimes, valuations}
) => {

    const ownershipShares = ownershipHistories.numShares[ticker];
    
    if (ownershipShares) {
        const key = getKey(subtype);
        const ownershipTimes = ownershipHistories.times[ticker];
        const prices = candlePrices[key][ticker];
        const times = candleTimes[key][ticker];

        valuations[key][ticker] = calcValuations(
            times,
            prices,
            ownershipTimes,
            ownershipShares,
        );
    }

}

const binarySearch = (arr, tar, type, i = 0, j = arr.length) => {
    if (j - i < 2) {
        if (type === 1) return i + (tar > arr[i] ? 1 : 0);

        // cannot use (tar < arr[i] ? 1 : 0) even though it is logically
        // equivalent, as it is possible that i can be as large as the 
        // array length, so arr[i] could be undefined. The below logic
        // implicitly handles that. Who decided to build the modern internet
        // on a programming language that can return two different results from
        // two logically equivalent statements?
        return i - (tar >= arr[i] ? 0 : 1);
    }

    let mid = Math.floor((i + j) / 2);

    if (tar < arr[mid]) { 
        j = mid
    } else if (tar > arr[mid]) {
        i = mid + 1
    } else return mid;
    
    return binarySearch(arr, tar, type, i, j)
}

const calcValuations = (times, prices, ownershipTimes, ownershipShares) => {

    if (ownershipShares.last() === 0 && ownershipTimes.last < times[0]) {
        const zeros = [];
        for(let i = 0; i < times.length; i++) zeros.push(0);
        return zeros;
    }

    let pricesPointer = 0;
    let historyPointer = 0;
    const valuations = [];

    if (times[0] > ownershipTimes[0]) {
        historyPointer = binarySearch(ownershipTimes, times[0], -1);
    }

    // cannot be done in else statement above because binarySearch may
    // return 0
    if (!historyPointer) {
        while (times[pricesPointer] < ownershipTimes[historyPointer]) {
            valuations.push(0);
            pricesPointer++;
        }
    }

    while (valuations.length < prices.length) {
        if (times[pricesPointer] < ownershipTimes[historyPointer]) {
            pricesPointer++;
            continue;
        }

        const nextHistIdx = historyPointer + 1;
        const idxLeft = ownershipTimes.length - nextHistIdx;
        
        if (idxLeft && times[pricesPointer] >= ownershipTimes[nextHistIdx]) {
            historyPointer++;
            continue;
        }

        valuations.push(ownershipShares[historyPointer] * prices[pricesPointer])
        pricesPointer++;

    }
    return valuations;
}