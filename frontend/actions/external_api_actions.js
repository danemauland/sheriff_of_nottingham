import {
    pricesAreLoaded,
    assetIsInitialized,
    companyOverviewIsLoaded,
    tickerDataIsLoaded,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
    getStartTime,
    inMarketHours,
    convertToCents,
    getEndTime,
} from "../util/dashboard_calcs";
import * as externalAPIUtil from "../util/external_api_util"
import {
    setAPIDebounceStartTime,
    removeAPIDebounceStartTime,
} from "./api_debounce_start_time_actions";
import {DateTime} from "luxon";

export const FETCH_CANDLES = "FETCH_CANDLES";
export const FETCH_QUOTE = "FETCH_QUOTE";
export const FETCH_COMPANY_OVERVIEW = "FETCH_COMPANY_OVERVIEW";
export const FETCH_TICKER_DATA = "FETCH_TICKER_DATA";
export const RECEIVE_TICKER_DATA = "RECEIVE_TICKER_DATA";
export const FETCH_COMPANY_NEWS = "FETCH_COMPANY_NEWS";
export const RECEIVE_COMPANY_NEWS = "RECEIVE_COMPANY_NEWS";
export const FETCH_MARKET_NEWS = "FETCH_MARKET_NEWS";
export const RECEIVE_MARKET_NEWS = "RECEIVE_MARKET_NEWS";
export const RECEIVE_COMPANY_OVERVIEW = "RECEIVE_COMPANY_OVERVIEW";
export const RECEIVE_CANDLES = "RECEIVE_CANDLES";
export const RECEIVE_DAILY_CANDLES = "RECEIVE_DAILY_CANDLES";
export const RECEIVE_WEEKLY_CANDLES = "RECEIVE_WEEKLY_CANDLES";
export const RECEIVE_ANNUAL_CANDLES = "RECEIVE_ANNUAL_CANDLES";
export const RECEIVE_QUOTE = "RECEIVE_QUOTE";
export const INITIALIZE_ASSETS = "INITIALIZE_ASSETS";
export const INITIALIZE_ASSET = "INITIALIZE_ASSET";
export const FLUSH_ASSET = "FLUSH_ASSET";
export const DAILY_RESOLUTION = 5;
export const WEEKLY_RESOLUTION = 15;
export const MONTHLY_RESOLUTION = 60;
export const RECEIVE_INTRADAY_PRICES = "RECEIVE_INTRADAY_PRICES";
export const RECEIVE_ONE_DAY_PRICES = "RECEIVE_ONE_DAY_PRICES";
export const RECEIVE_DAILY_PRICES = "RECEIVE_DAILY_PRICES";
const FETCH_INTRADAY_PRICES = "FETCH_INTRADAY_PRICES";
const FETCH_DAILY_PRICES = "FETCH_DAILY_PRICES";
const ANNUAL_RESOLUTION = "D";
const FETCH_ONE_DAY_PRICES = "FETCH_ONE_DAY_PRICES";
const FETCH_SEARCH_RESULTS = "FETCH_SEARCH_RESULTS";
export const RECEIVE_SEARCH_RESULTS = "RECEIVE_SEARCH_RESULTS";

const receiveSearchResults = ({bestMatches: results}) => {
    results = results.filter(result => result["4. region"] === "United States");
    results = results.map(result => [result["1. symbol"], result["2. name"]]);
    return {results};
}

const initializeAsset = ticker => ({
    type: INITIALIZE_ASSET,
    ticker,
});

const receiveCandles = (ticker, candles, type) => (dispatch, getState) => {
    const assetInformation = getState().newEntities.assetInformation;
    const ownershipHistories = assetInformation.ownershipHistories;
    const tickers = assetInformation.tickers;
    const candlePrices = assetInformation.candlePrices;
    // dispatch({
    //     type,
    //     ticker,
    //     tickers,
    //     candles,
    //     ownershipHistory: {
    //         times: ownershipHistories.times[ticker],
    //         numShares: ownershipHistories.numShares[ticker],
    //     },
    //     candlePrices,
    // });
    dispatch({
        type: RECEIVE_CANDLES,
        subtype: type,
        ticker,
        tickers,
        candles,
        ownershipHistory: {
            times: ownershipHistories.times[ticker],
            numShares: ownershipHistories.numShares[ticker],
        },
        candlePrices,
    });
};

const convertStrToCents = str => {
    const n = parseFloat(str);
    return convertToCents(n);
};

const receiveIntradayPrices = (data, ticker) => {
    let test = data.split("\n");
    let timeSeries = [];
    test.forEach((val, i) => {
        if (i) {
            const arr = val.split(",").map((value, i) => {
                // if value is the volume
                if (i === 5) return parseInt(value);

                // if value is not the timestamp
                if (i) return convertStrToCents(value);

                return value;
            });
            const time = DateTime.fromSQL(arr[0], {zone: "America/New_York"}).toSeconds();
            arr[0] = time;
            if (inMarketHours(time)) timeSeries.push(arr);
        }
    })
    timeSeries.sort((a, b) => a[0] - b[0]);

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
    const times = {oneWeek: oneWeekTimes, oneMonth: oneMonthTimes};
    const prices = {oneWeek: {[ticker]: oneWeekPrices}, oneMonth: {[ticker]: oneMonthPrices}};
    const startPrices = {oneWeek: {[ticker]: oneWeek[0][1]}, oneMonth: {[ticker]: oneMonth[0][1]}};
    return ({
        type: RECEIVE_INTRADAY_PRICES,
        times,
        prices,
        ticker,
        startPrices,
    });
};

const receiveOneDayPrices = (timeSeries, ticker) => {
    const oneDayTimes = [];
    const oneDayPrices = [];
    for(let i = 0; i < timeSeries.t.length; i++) {
        oneDayTimes.push(timeSeries.t[i]);
        oneDayPrices.push(convertToCents(timeSeries.o[i]));
    }
    if (oneDayTimes.length < 79) {
        oneDayTimes.push(Date.parse(new Date) / 1000);
        oneDayPrices.push(convertToCents(timeSeries.c.last()));
    }
    validateOneDayTimesAndPrices(oneDayTimes, oneDayPrices);
    const times = {oneDay: oneDayTimes};
    const prices = {oneDay: {[ticker]: oneDayPrices}};
    // if (ticker==="GOOG") debugger;
    return ({
        type: RECEIVE_ONE_DAY_PRICES,
        ticker,
        times,
        prices,
    });
};


// Yes, the below code "makes up" prices but I'm not willing to pay $100/month
// for a more reliable API provider
const validateOneDayTimesAndPrices = (times, prices) => {
    const startTime = Date.parse(getStartTime(ONE_DAY)) / 1000;
    if (startTime !== times[0]) {
        times.unshift(startTime);
        prices.unshift(prices[0]);
    }
    for(let i = 1; i < times.length - 1; i++) {
        const newTime = times[i - 1] + DAILY_RESOLUTION * 60;
        if (times[i] !== newTime) {
            times.splice(i, 0, newTime);
            prices.splice(i, 0, (prices[i - 1] + prices[i]) / 2);
        }
    }
}

const receiveDailyPrices = (data, ticker) => {
    let timeSeries = [];
    const oneYearStartTime = Date.parse(getStartTime(ONE_YEAR)) / 1000;
    for(let pair of Object.entries(data["Time Series (Daily)"])) {
        const [key, vals] = pair;
        const time = DateTime.fromSQL(key, {zone: "America/New_York"}).toSeconds();
        
        // DATES MAY BE OUT OF ORDER, CANNOT JUST BSEARCH FOR ONE YEAR START
        if (time < oneYearStartTime) continue;
        // const series = [];
        // series.push();
        // series.push(convertStrToCents(vals["4. close"]));
        // series.push(parseInt(vals["5. volume"]));
        // series.push(vals);
        timeSeries.push([time, ...Object.values(vals)]);
    }
    timeSeries.sort((a, b) => a[0] - b[0]);
    
    let threeMonthStartTime = Date.parse(getStartTime(THREE_MONTH)) / 1000;
    const threeMonth = timeSeries.filter(series => series[0] >= threeMonthStartTime);
    const threeMonthTimes = [];
    const threeMonthPrices = [];
    for(let i = 0; i < threeMonth.length; i++) {
        threeMonthTimes.push(threeMonth[i][0]);
        threeMonthPrices.push(convertStrToCents(threeMonth[i][5]));
    }
    const oneYearTimes = [];
    const oneYearPrices = [];
    
    for(let i = 0; i < timeSeries.length; i++) {
        oneYearTimes.push(timeSeries[i][0]);
        oneYearPrices.push(convertStrToCents(timeSeries[i][5]));
    }
    
    const times = {};
    const prices = {threeMonth: {}, oneYear: {}};
    
    times.threeMonth = threeMonthTimes;
    times.oneYear = oneYearTimes;
    prices.threeMonth[ticker] = threeMonthPrices;
    prices.oneYear[ticker] = oneYearPrices;
    const startPrices = {
        oneDay: {[ticker]: oneYearPrices[oneYearPrices.length - 2]},
        oneYear: {[ticker]: convertStrToCents(timeSeries[0][1])},
        threeMonth: {[ticker]: convertStrToCents(threeMonth[0][1])},
    };
    return ({
        type: RECEIVE_DAILY_PRICES,
        times,
        prices,
        ticker,
        startPrices,
    });
};

const leftPad = (str, num) => {
    while (str.length < num) {
        str = "0" + str;
    }
    return str;
}

const receiveQuote = (ticker, quote) => ({
    type: RECEIVE_QUOTE,
    ticker,
    quote
});

const receiveCompanyOverview = (ticker, companyOverview) => ({
    type: RECEIVE_COMPANY_OVERVIEW,
    ticker,
    companyOverview,
});

const receiveTickerData = (ticker, tickerData) => ({
    type: RECEIVE_TICKER_DATA,
    ticker,
    tickerData,
});

const receiveCompanyNews = (ticker, companyNews) => ({
    type: RECEIVE_COMPANY_NEWS,
    ticker,
    companyNews,
});

const receiveMarketNews = marketNews => ({
    type: RECEIVE_MARKET_NEWS,
    marketNews,
});

const flushAsset = ticker => ({
    type: FLUSH_ASSET,
    ticker,
});


const qFunc = action => {
    const ticker = action.ticker;
    const start = action.start;
    const end = action.end;
    switch (action.type) {
        case FETCH_SEARCH_RESULTS:
            externalAPIUtil.fetchSearchResults(action.keywords).then(
                results => action.setState(receiveSearchResults(results)),
                err => console.log(err),
            );
            break;

        case FETCH_INTRADAY_PRICES:
            externalAPIUtil.fetchIntradayPrices(ticker).then(
                data => action.dispatch(receiveIntradayPrices(data, ticker)),
                err => console.log(err)
            );
            break;

        case FETCH_ONE_DAY_PRICES:
            externalAPIUtil.fetchOneDayPrices(ticker).then(
                data => action.dispatch(receiveOneDayPrices(data, ticker)),
                err => console.log(err)
            );
            break;

        case FETCH_DAILY_PRICES:
            externalAPIUtil.fetchDailyPrices(ticker).then(
                data => action.dispatch(receiveDailyPrices(data, ticker)),
                err => console.log(err)
            );
            break;

        case FETCH_CANDLES:
            externalAPIUtil.fetchCandles(ticker, action.resolution, start, end).then(
                candles => {
                    if (candles.s === "no_data") {
                        action.dispatch(flushAsset(ticker));
                    } else {
                        action.dispatch(receiveCandles(ticker, candles, action.subtype))
                    }
                },
                error => console.log(error),
            );
            break;
        case FETCH_QUOTE:
            // finnhubClient.quote(ticker, (error, data, response) => {
            //     console.log(error);
            //     action.dispatch(receiveQuote(ticker, data))
            // })
            break;
        case FETCH_TICKER_DATA:
            externalAPIUtil.fetchTickerData(ticker).then(
                tickerData => action.dispatch(receiveTickerData(ticker, tickerData)),
                () => action.dispatch(receiveTickerData(ticker, []))
            );
            break;
        case FETCH_COMPANY_OVERVIEW:
            externalAPIUtil.fetchCompanyOverview(ticker).then(
                companyOverview => action.dispatch(receiveCompanyOverview(ticker, companyOverview))
            );
            break;
        case FETCH_COMPANY_NEWS:
            externalAPIUtil.fetchCompanyNews(ticker, start, end).then(
                companyNews => action.dispatch(receiveCompanyNews(ticker, companyNews)),
                () => action.dispatch(receiveCompanyNews(ticker, []))
            );
            break;
        case FETCH_MARKET_NEWS:
            externalAPIUtil.fetchMarketNews(start, end).then(
                marketNews => action.dispatch(receiveMarketNews(marketNews))
            );
            break;
        default:
            break;
    }
};

function Queue(func, time, maxPerMin, provider) {
    this.func = func;
    this.time = time;
    this.queue = [];
    this.running = false;
    this.maxPerMin = maxPerMin;
    this.outStandingRequests = 0;
    this.waiting = false;
    this.timesQueue = [];
    this.provider = provider;
}
Queue.prototype.setDispatch = function(dispatch) {
    this.dispatch = dispatch
}

Queue.prototype.push = function (arg) {
    this.queue.push(arg);
    if (this.shouldStart()) this.run();
}

Queue.prototype.shouldStart = function () {
    return !this.running && !this.waiting
}

Queue.prototype.shift = function () {
    this.queue.shift();
}

Queue.prototype.run = function () {
    this.running = this.queue.length > 0;
    this.waiting = (this.outStandingRequests === this.maxPerMin && this.running);
    if (this.waiting) {
        const apiPullsLeft = this.queue.length;
        this.dispatch(setAPIDebounceStartTime(this.timesQueue[apiPullsLeft - 1]));
    }
    if (this.running && !this.waiting) {
        this.outStandingRequests++;
        const arg = this.queue.shift();
        const func = this.func;
        setTimeout(() => {
            func(arg)
            this.run()
            this.timesQueue.push(new Date());
        }, this.time)
        setTimeout(() => {
            this.outStandingRequests--;
            if (this.waiting) {this.dispatch(removeAPIDebounceStartTime())}
            this.waiting = false;
            this.timesQueue.shift();
            this.run();
        }, 61000)
    }  
}

export const finnhubQ = new Queue(qFunc, 50, 25, "finn");
export const alphaQ = new Queue(qFunc, 50, 25, "alpha");
export const polygonQ = new Queue(qFunc, 50, 5, "polygon");

export const fetchSearchResults = (keywords, setState) => {
    const action = {
        type: FETCH_SEARCH_RESULTS,
        keywords,
        setState
    }
    alphaQ.push(action);
}

const fetchIntradayPrices = (ticker, dispatch) => {
    const action = {
        type: FETCH_INTRADAY_PRICES,
        dispatch,
        ticker,
    }
    alphaQ.push(action);
}

const fetchOneDayPrices = (ticker, dispatch) => {
    const action = {
        type: FETCH_ONE_DAY_PRICES,
        dispatch,
        ticker,
    };
    finnhubQ.push(action);
}

const fetchDailyPrices = (ticker, dispatch) => {
    const action = {
        type: FETCH_DAILY_PRICES,
        dispatch,
        ticker,
    };
    finnhubQ.push(action);
}

export const fetchCandles = (ticker, dispatch, subtype = ONE_DAY) => {
    const endTime = getEndTime();
    let timeframe;
    let resolution;

    switch (subtype) {
        case ONE_WEEK:
            timeframe = ONE_WEEK;
            resolution = DAILY_RESOLUTION;
            break;
        case ONE_MONTH:
            timeframe = ONE_MONTH;
            resolution = MONTHLY_RESOLUTION;
            break;
        case ONE_YEAR:
            timeframe = ONE_YEAR;
            resolution = ANNUAL_RESOLUTION;
            break;
        default:
            break;
    }

    const action = {
        type: FETCH_CANDLES,
        subtype,
        ticker,
        resolution,
        start: Date.parse(getStartTime(timeframe)) / 1000,
        end: Date.parse(endTime) / 1000,
        dispatch,
    }
    finnhubQ.push({...action})
}

export const fetchQuote = ticker => dispatch => {
    const action = {
        type: FETCH_QUOTE,
        ticker,
        dispatch,
    }
    finnhubQ.push({...action});
}

export const initializeAssets = (trades, cashTransactions) => ({
    type: INITIALIZE_ASSETS,
    trades,
    cashTransactions,
})

export const fetchCompanyOverview = (ticker, dispatch) => {
    const action = {
        type: FETCH_COMPANY_OVERVIEW,
        ticker,
        dispatch,
    }
    alphaQ.push({...action});
}

export const fetchTickerData = (ticker, dispatch) => {
    const action = {
        type: FETCH_TICKER_DATA,
        ticker,
        dispatch,
    }
    polygonQ.push({ ...action });
}

function formatDate(date) {
    const year = date.getUTCFullYear().toString();
    const month = (1 + date.getUTCMonth()).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");;
    return `${year}-${month}-${day}`;
}

export const fetchCompanyNews = (ticker, dispatch) => {
    let startTime = new Date()
    startTime.setUTCFullYear(startTime.getUTCFullYear() - 1);
    let endTime = new Date();
    const action = {
        type: FETCH_COMPANY_NEWS,
        ticker,
        dispatch,
        start: formatDate(startTime),
        end: formatDate(endTime),
    }
    finnhubQ.push(action)
}

export const fetchMarketNews = dispatch => {
    const action = {
        type: FETCH_MARKET_NEWS,
        dispatch,
    }
    finnhubQ.push(action);
}

export const fetchAllCandles = (tickers, dispatch) => {
    if (!isIterable(tickers)) tickers = [tickers];
    for(let ticker of tickers) {
        fetchIntradayPrices(ticker, dispatch);
        fetchOneDayPrices(ticker, dispatch);
        fetchDailyPrices(ticker, dispatch);
        // fetchCandles(ticker, dispatch, ONE_MONTH);
        // fetchCandles(ticker, dispatch, ONE_YEAR);
    }
}

export const fetchAllInfo = (tickers, dispatch) => {
    if (typeof tickers === "string") tickers = [tickers];
    fetchAllCandles(tickers, dispatch);
    for(let ticker of tickers) {
        fetchCompanyOverview(ticker, dispatch);
        fetchTickerData(ticker, dispatch);
    }
}

export const fetchNeededInfo = (
    tickersToFetch,
    {tickers, prices, companyOverviews, tickerData},
    dispatch
) => {
    tickers = Set.convert(tickers);
    tickersToFetch = Array.convert(tickersToFetch);
    for(let ticker of tickersToFetch) {
        if (!assetIsInitialized(ticker, tickers)) {
            dispatch(initializeAsset(ticker));
            fetchAllInfo(ticker, dispatch);
            continue;
        }

        if (!pricesAreLoaded(ticker, prices)) {
            fetchAllCandles(ticker, dispatch);
        }
        if (!companyOverviewIsLoaded(ticker, companyOverviews)) {
            fetchCompanyOverview(ticker, dispatch);
        }
        if (!tickerDataIsLoaded(ticker, tickerData)) {
            fetchTickerData(ticker, dispatch);
        }
    }
}

const isIterable = variable => (
    typeof variable[Symbol.iterator] === "function"
);