import { times } from "async";
import {
    DAILY_RESOLUTION,
    WEEKLY_RESOLUTION,
    MONTHLY_RESOLUTION,
} from "../actions/external_api_actions";

import {
    getMarketCloseHour,
    getStartTime,
    convertToCents,
    camelCase,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "./dashboard_calcs";

export const defaultState = Object.freeze({
    assetInformation: {
        tickers: new Set(),
        ownershipHistories: {
            times: {},
            numShares: {},
        },
        prices: {
            oneDay: {},
            oneWeek: {},
            oneMonth: {},
            threeMonth: {},
            oneYear: {},
        },
        valuations: {
            oneDay: {},
            oneWeek: {},
            oneMonth: {},
            threeMonth: {},
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
        trades: {},
        positionCosts: {},
    },
    marketNews: [],
    times: {
        oneDay: [],
        oneWeek: [],
        oneMonth: [],
        threeMonth: [],
        oneYear: [],
    },
    portfolioHistory: {
        cashTransactions: [],
        cashHistory: {
            times: [],
            balances: [],
        },
        valuations: {
            oneDay: [],
            oneWeek: [],
            oneMonth: [],
            threeMonth: [],
            oneYear: [],
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

const isLastPeriod = (time, type) => {
    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const marketCloseHour = getMarketCloseHour(time);

    if (hours !== marketCloseHour - 1) return false;

    let resolution;
    switch (type) {
        case ONE_DAY:
            resolution = DAILY_RESOLUTION;
            break;

        case ONE_WEEK:
            resolution = WEEKLY_RESOLUTION;
            break;
    }

    const minutes = date.getUTCMinutes();
    
    return minutes === (60 - resolution);
}

// const pullTimesAndPrices = (candles, type) => {
//     const newTimes = [];
//     const prices = [];
    
//     for(let i = 0; i < candles.t.length; i++ ) {
        
//         if (inMarketHours(candles.t[i])) {
//             newTimes.push(candles.t[i]);
//             prices.push(convertToCents(candles.o[i]));
            
//             // times/prices are based on the opening times/prices of each
//             // candle. The below code adds the closing time/price
//             if (i === candles.t.length - 1) {
//                 const secondsSinceEpoch = Date.parse(new Date()) / 1000
//                 newTimes.push(secondsSinceEpoch);
//                 prices.push(convertToCents(candles.c[i]));
//             } else if (isLastPeriod(candles.t[i], type)) {
//                 // converts time to milliseconds since epoch
//                 // then uses that to construct date object
//                 let newTime = new Date(candles.t[i] * 1000);

//                 // sets time to market close
//                 newTime.setUTCHours(newTime.getUTCHours() + 1);
//                 newTime.setUTCMinutes(0);

//                 // converts back to seconds since epoch
//                 newTimes.push(Date.parse(newTime) / 1000);

//                 prices.push(convertToCents(candles.c[i]));
//             }
//         }

        
//     }
//     return [newTimes, prices];
// }

// export const setTimesAndPrices = (
//     {subtype, ticker, candles},
//     {candlePrices, candleTimes, prevVolume, curVolume, historicPrices}
// ) => {

//     let times;
//     let prices;
//     const key = getKey(subtype);

//     if (key === "oneYear") {
//         times = candles.t;
//         prices = candles.c.map(price => Math.floor(price * 100));

//         prevVolume[ticker] = candles.v[candles.v.length - 2];
//         curVolume[ticker] = candles.v.last();
//     } else {
//         [times, prices] = pullTimesAndPrices(candles, subtype);
//     }

//     candlePrices[key][ticker] = prices;
//     candleTimes[key][ticker] = times;

//     if (key !== "oneWeek") {
//         const minPrice = Math.min(...candles.l);
//         const maxPrice = Math.max(...candles.h);
//         historicPrices[key + "Low"][ticker] = convertToCents(minPrice);
//         historicPrices[key + "High"][ticker] = convertToCents(maxPrice);
//         if (key === "oneDay") {
//             historicPrices.oneDayOpen[ticker] = convertToCents(candles.o[0]);
//         }
//     }
// }

const pullPrices = (candles, times) => {
    const prices = [];
    
    for(let i = 0; i < times.length; i++ ) {
        
            prices.push(convertToCents(candles.o[i]));
            
            // times/prices are based on the opening times/prices of each
            // candle. The below code adds the closing time/price
            if (i === candles.t.length - 1) {
                const secondsSinceEpoch = Date.parse(new Date()) / 1000
                newTimes.push(secondsSinceEpoch);
                prices.push(convertToCents(candles.c[i]));
            } else if (isLastPeriod(candles.t[i], type)) {
                // converts time to milliseconds since epoch
                // then uses that to construct date object
                let newTime = new Date(candles.t[i] * 1000);

                // sets time to market close
                newTime.setUTCHours(newTime.getUTCHours() + 1);
                newTime.setUTCMinutes(0);

                // converts back to seconds since epoch
                newTimes.push(Date.parse(newTime) / 1000);

                prices.push(convertToCents(candles.c[i]));
            }

        
    }
    return [newTimes, prices];
}

const pullTimesAndPrices = (candles, interval, start, check = () => true, typeOverride) => {
    const newTimes = [];
    const newPrices = [];
    const times = candles.t;
    const prices = candles[typeOverride || "o"];

    interval *= 60;
    start = Date.parse(start) / 1000;
    for(let i = 0; i < times.length; i++) {
        if (times[i] < start) continue;
        if (times[i] % interval === 0 && check(times[i])) {
            newTimes.push(times[i]);
            newPrices.push(convertToCents(prices[i]));
        }
    }

    return [newTimes, newPrices];
};

export const setIntradayTimesAndPrices = (
    {ticker, timeSeries},
    {prices: allPrices, prevVolume, curVolume, historicPrices},
    datetimes
) => {
    const oneWeekStartTime = Date.parse(getStartTime(ONE_WEEK)) / 1000;
    const oneWeek = timeSeries.filter(series => series[0] >= oneWeekStartTime && series[0] % (WEEKLY_RESOLUTION * 60) === 0);
    const oneWeekTimes = [];
    const oneWeekPrices = [];
    for(let i = 0; i < oneWeek.length; i++) {
        let isFirstPeriod = i === 0;
        const curPeriod = new Date(oneWeek[i][0] * 1000);
        if (!isFirstPeriod) {
            const prevPeriod = new Date(oneWeek[i - 1][0] * 1000);
            isFirstPeriod = prevPeriod.getUTCDay() !== curPeriod.getUTCDay();
        }
        if (isFirstPeriod) {
            curPeriod.setUTCMinutes(30);
            oneWeekTimes.push(Date.parse(curPeriod) / 1000);
            oneWeekPrices.push(oneWeek[i][1]);
        }
        oneWeekTimes.push(oneWeek[i][0]);
        oneWeekPrices.push(oneWeek[i][4]);
    }

    const oneMonthStartTime = Date.parse(getStartTime(ONE_MONTH)) / 1000;
    const oneMonth = timeSeries.filter(series => series[0] >= oneMonthStartTime && series[0] % (MONTHLY_RESOLUTION * 60) === 0);
    const oneMonthTimes = [];
    const oneMonthPrices = [];

    for(let i = 0; i < oneMonth.length; i++) {
        oneMonthTimes.push(oneMonth[i][0]);
        oneMonthPrices.push(oneMonth[i][4]);
    }
    // const oneMonthTimes = [];
    // const oneMonthPrices = [];
    // const oneWeekTimes = [];
    // const oneWeekPrices = [];
    // let i = -1;
    // while(seriesTimes[++i] >= oneMonthStartTime) {
    //     let time = seriesTimes[i];
    //     if (!inMarketHours(time)) continue;
    //     let price = seriesPrices[i];
    //     if (time % (MONTHLY_RESOLUTION * 60) === 0) {
    //         oneMonthTimes.push(time);
    //         oneMonthPrices.push(price);
    //     }
    //     if (time >= oneWeekStartTime && time % (WEEKLY_RESOLUTION * 60) === 0) {
    //         oneWeekTimes.push(time);
    //         oneWeekPrices.push(price);
    //     }
    // }
    datetimes.oneWeek = oneWeekTimes;
    datetimes.oneMonth = oneMonthTimes;
    allPrices.oneWeek[ticker] = oneWeekPrices;
    allPrices.oneMonth[ticker] = oneMonthPrices;
}

export const setDailyTimesAndPrices = (
    {ticker, timeSeries},
    {prices: allPrices, prevVolume, curVolume, historicPrices},
    datetimes
) => {
    const threeMonthStartTime = Date.parse(getStartTime(THREE_MONTH)) / 1000;
    const threeMonth = timeSeries.filter(series => series[0] >= threeMonthStartTime);
    const threeMonthTimes = [];
    const threeMonthPrices = [];
    for(let i = 0; i < threeMonth.length; i++) {
        threeMonthTimes.push(threeMonth[i][0]);
        threeMonthPrices.push(threeMonth[i][1]);
    }

    const oneYearTimes = [];
    const oneYearPrices = [];

    for(let i = 0; i < timeSeries.length; i++) {
        oneYearTimes.push(timeSeries[i][0]);
        oneYearPrices.push(timeSeries[i][1]);
    }
    datetimes.threeMonth = threeMonthTimes;
    datetimes.oneYear = oneYearTimes;
    allPrices.threeMonth[ticker] = threeMonthPrices;
    allPrices.oneYear[ticker] = oneYearPrices;
}

export const setOneDayTimesAndPrices = (
    {ticker, timeSeries},
    {prices: allPrices, prevVolume, curVolume, historicPrices},
    datetimes
) => {
    const oneDayTimes = [];
    const oneDayPrices = [];
    for(let i = 0; i < timeSeries.t.length; i++) {
        oneDayTimes.push(timeSeries.t[i]);
        oneDayPrices.push(convertToCents(timeSeries.o[i]));
    }
    datetimes.oneDay = oneDayTimes;
    allPrices.oneDay[ticker] = oneDayPrices;
}

export const setTimesAndPrices = (
    {subtype, ticker, candles},
    {prices, prevVolume, curVolume, historicPrices},
    times
) => {
    let newTimes, newPrices, minPrice, maxPrice;

    switch (subtype) {
        // case ONE_WEEK:
        //     [newTimes, newPrices] = pullTimesAndPrices(candles, DAILY_RESOLUTION, getStartTime(ONE_DAY), inMarketHours);
        //     times.oneDay = newTimes;
        //     prices.oneDay[ticker] = newPrices;
        //     [newTimes, newPrices] = pullTimesAndPrices(candles, WEEKLY_RESOLUTION, getStartTime(ONE_WEEK), inMarketHours);
        //     times.oneWeek = newTimes;
        //     prices.oneWeek[ticker] = newPrices;
        //     historicPrices.oneDayOpen[ticker] = convertToCents(candles.o[0]);
        //     [newTimes, newPrices] = pullTimesAndPrices(candles, DAILY_RESOLUTION, getStartTime(ONE_DAY), inMarketHours, "l");
        //     minPrice = Math.min(...newPrices);
        //     [newTimes, newPrices] = pullTimesAndPrices(candles, DAILY_RESOLUTION, getStartTime(ONE_DAY), inMarketHours, "h");
        //     maxPrice = Math.max(...newPrices);
        //     historicPrices["oneDayLow"][ticker] = convertToCents(minPrice);
        //     historicPrices["oneDayHigh"][ticker] = convertToCents(maxPrice);
        //     break;

        // case ONE_MONTH:
        //     [newTimes, newPrices] = pullTimesAndPrices(candles, MONTHLY_RESOLUTION, getStartTime(ONE_MONTH), inMarketHours);
        //     times.oneMonth = newTimes;
        //     prices.oneMonth[ticker] = newPrices;
        //     break;

        case ONE_YEAR:
            [newTimes, newPrices] = pullTimesAndPrices(candles, MONTHLY_RESOLUTION, getStartTime(THREE_MONTH), isTradingDay, "c");
            times.threeMonth = newTimes;
            prices.threeMonth[ticker] = newPrices;
            [newTimes, newPrices] = pullTimesAndPrices(candles, MONTHLY_RESOLUTION, getStartTime(ONE_YEAR), isTradingDay, "c");
            times.oneYear = newTimes;
            prices.oneYear[ticker] = newPrices;
            prevVolume[ticker] = candles.v[candles.v.length - 2];
            curVolume[ticker] = candles.v.last();
            minPrice = Math.min(...candles.l);
            maxPrice = Math.max(...candles.h);
            historicPrices["oneYearLow"][ticker] = convertToCents(minPrice);
            historicPrices["oneYearHigh"][ticker] = convertToCents(maxPrice);
            break;
    }
}

const isTradingDay = time => {
    const date = new Date(time * 1000);
    return date.getUTCDay() !== 0 && date.getUTCDay() !== 6;
}

export const getKey = type => {
    switch (type) {
        case ONE_DAY:
            return "oneDay";
        case ONE_WEEK:
            return "oneWeek";
        case ONE_YEAR:
            return "oneYear";
    }
}

export const updatePortfolioValuations = (
    {tickers},
    {prices, valuations: assetValuations},
    {cashHistory, valuations},
    times,
) => {

    const allPrices = Object.values(prices);

    const needToUpdate = allPrices.every(prices => {
        return Object.keys(prices).length === tickers.size;
    });

    if (!needToUpdate) return;

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
        oneMonth: [],
        threeMonth: [],
        oneYear: [],
    };

    for (let timeFrame in times) {
        calcTimeFrameTotals(
            times[timeFrame],
            valuations[timeFrame],
            aggValues[timeFrame],
            tickers,
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
    {ownershipHistories, prices, valuations},
    times,
) => {

    const ownershipShares = ownershipHistories.numShares[ticker];
    
    if (!ownershipShares) return;

    const ownershipTimes = ownershipHistories.times[ticker];

    switch (subtype) {
        case ONE_WEEK:
            valuations.oneDay[ticker] = calcValuations(
                times.oneDay,
                prices.oneDay[ticker],
                ownershipTimes,
                ownershipShares,
            );
            valuations.oneWeek[ticker] = calcValuations(
                times.oneWeek,
                prices.oneWeek[ticker],
                ownershipTimes,
                ownershipShares,
            );
            break;

        case ONE_MONTH:
            valuations.oneMonth[ticker] = calcValuations(
                times.oneMonth,
                prices.oneMonth[ticker],
                ownershipTimes,
                ownershipShares,
            );
            break;
    
        case ONE_YEAR:
            valuations.threeMonth[ticker] = calcValuations(
                times.threeMonth,
                prices.threeMonth[ticker],
                ownershipTimes,
                ownershipShares,
            );
            valuations.oneYear[ticker] = calcValuations(
                times.oneYear,
                prices.oneYear[ticker],
                ownershipTimes,
                ownershipShares,
            );
            break;
    
        default:
            break;
    }
    {
        const key = camelCase(subtype);
        const tickerPrices = prices[key][ticker];

        valuations[key][ticker] = calcValuations(
            times[key],
            tickerPrices,
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

        valuations.push(ownershipShares[historyPointer] *prices[pricesPointer]);
        pricesPointer++;

    }
    return valuations;
}

export const getTradesByTicker = initialTrades => {
    const trades = [...initialTrades].sort((a, b) => a.createdAt - b.createdAt);
    const tradesByTicker = {};

    for (let trade of trades) {
        const ticker = trade.ticker;

        if (!tradesByTicker[ticker]) {
            tradesByTicker[ticker] = [];
        }

        tradesByTicker[ticker].push(trade);
    }
    return tradesByTicker;
}

export const calcPositionCosts = (tickers, trades, numShares) => {
    const posCosts = {};

    tickers.forEach(ticker => {
        const sharesOwned = numShares[ticker].last();
        posCosts[ticker] = calcPositionCost(trades[ticker], sharesOwned);
    });

    return posCosts;
};

const calcPositionCost = (trades, sharesOwned) => {
    let sharesRemaining = sharesOwned;

    let cost = 0;
    let i = trades.length - 1;

    while (sharesRemaining !== 0) {
        const trade = trades[i--];
        let numShares = trade.numShares;

        const sharesRemainingHits0 = (
            (sharesRemaining <= 0) !== (sharesRemaining + numShares <= 0)
        );
        if (sharesRemainingHits0) numShares = sharesRemaining;

        cost += trade.tradePrice * numShares;
        sharesRemaining -= numShares;
    }
    return cost;
};