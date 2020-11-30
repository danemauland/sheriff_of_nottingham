import * as externalAPIUtil from "../util/external_api_util"
import {
    setAPIDebounceStartTime,
    removeAPIDebounceStartTime,
} from "./api_debounce_start_time_actions";

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
export const RECEIVE_DAILY_CANDLES = "RECEIVE_DAILY_CANDLES";
export const RECEIVE_WEEKLY_CANDLES = "RECEIVE_WEEKLY_CANDLES";
export const RECEIVE_ANNUAL_CANDLES = "RECEIVE_ANNUAL_CANDLES";
export const RECEIVE_QUOTE = "RECEIVE_QUOTE";
export const INITIALIZE_ASSETS = "INITIALIZE_ASSETS";

const receiveCandles = (ticker, candles, type) => ({
    type,
    ticker,
    candles,
})

const receiveQuote = (ticker, quote) => ({
    type: RECEIVE_QUOTE,
    ticker,
    quote
})

const receiveCompanyOverview = (ticker, companyOverview) => ({
    type: RECEIVE_COMPANY_OVERVIEW,
    ticker,
    companyOverview,
})

const receiveTickerData = (ticker, tickerData) => ({
    type: RECEIVE_TICKER_DATA,
    ticker,
    tickerData,
})

const receiveCompanyNews = (ticker, companyNews) => ({
    type: RECEIVE_COMPANY_NEWS,
    ticker,
    companyNews,
})

const receiveMarketNews = marketNews => ({
    type: RECEIVE_MARKET_NEWS,
    marketNews,
})


const qFunc = action => {
    switch (action.type) {
        case FETCH_CANDLES:
            externalAPIUtil.fetchCandles(action.ticker, action.resolution, action.start, action.end).then(
                candles => action.dispatch(receiveCandles(action.ticker, candles, action.subtype)),
                error => console.log(error),
            );
            break;
        case FETCH_QUOTE:
            // finnhubClient.quote(action.ticker, (error, data, response) => {
            //     console.log(error);
            //     action.dispatch(receiveQuote(action.ticker, data))
            // })
            break;
        case FETCH_TICKER_DATA:
            externalAPIUtil.fetchTickerData(action.ticker).then(
                tickerData => action.dispatch(receiveTickerData(action.ticker, tickerData)),
                error => console.log(error),
            );
            break;
        case FETCH_COMPANY_OVERVIEW:
            externalAPIUtil.fetchCompanyOverview(action.ticker).then(
                companyOverview => action.dispatch(receiveCompanyOverview(action.ticker, companyOverview))
            );
        case FETCH_COMPANY_NEWS:
            externalAPIUtil.fetchCompanyNews(action.ticker, action.start, action.end).then(
                companyNews => action.dispatch(receiveCompanyNews(action.ticker, companyNews))
            );
        case FETCH_MARKET_NEWS:
            externalAPIUtil.fetchMarketNews(action.start, action.end).then(
                marketNews => action.dispatch(receiveMarketNews(marketNews))
            );
        default:
            break;
    }
}

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

export const finnhubQ = new Queue(qFunc, 50, 25, "finn")
export const alphaQ = new Queue(qFunc, 50, 25, "alpha")
export const polygonQ = new Queue(qFunc, 50, 5, "polygon")

//Date prototype functions added in entry file
export const dstAdjustment = time => {
    if (new Date().isDSTObserved()) {
        time.setUTCHours(time.getUTCHours() - 1)
    }
    return time;
}

const getStartTime = () => { //daylight savings adjustment made, but it will be wrong for
                             //the weekly candles if DST changed in the last week
    const startTime = new Date();
    const dst = startTime.isDSTObserved();
    const minutes = startTime.getUTCMinutes();
    const hours = startTime.getUTCHours();
    if (hours < (dst ? 13 : 14) || ((hours < (dst ? 14 : 15) && minutes < 30))) {
        startTime.setUTCDate(startTime.getUTCDate() - 1);
    }
    startTime.setUTCHours((dst ? 13 : 14));
    startTime.setMinutes(30);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);
    const day = startTime.getUTCDay();
    if (day === 6) {startTime.setUTCDate(startTime.getUTCDate() - 1)}
    else if (day === 0) { startTime.setUTCDate(startTime.getUTCDate() - 2)};
    return dstAdjustment(startTime);
}

const getEndTime = () => {
    const startTime = getStartTime();
    const now = new Date();
    if (now - startTime > (6.5 * 60 * 60 * 1000)) {
        startTime.setUTCHours(startTime.getUTCHours() + 7);
        startTime.setMinutes(0);
        return startTime;
    }
    return now;
}

export const fetchCandles = (ticker, dispatch, subtype = RECEIVE_DAILY_CANDLES) => {
    let startTime = getStartTime();
    const endTime = getEndTime();
    let resolution = 5;
    switch (subtype) {
        case RECEIVE_DAILY_CANDLES:
            break;
        case RECEIVE_WEEKLY_CANDLES:
            startTime.setUTCDate(startTime.getUTCDate() - 7);
            resolution = 30;
            break;
        case RECEIVE_ANNUAL_CANDLES:
            startTime.setUTCFullYear(startTime.getUTCFullYear() - 1);
            startTime.setUTCHours(startTime.getUTCHours() + 1); // Needed because API provider will return prices for (only) some stocks for the previous day otherwise
            startTime.setMinutes(0);
            resolution = "D";
            break;
        default:
            break;
    }
    const action = {
        type: FETCH_CANDLES,
        subtype,
        ticker,
        resolution,
        start: Date.parse(startTime) / 1000,
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

export const initializeAssets = state => ({
    type: INITIALIZE_ASSETS,
    trades: state.entities.trades,
    cashTransactions: state.entities.cashTransactions,
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
    return "" + date.getUTCFullYear() + "-" + (1 + date.getUTCMonth()) + "-" + date.getUTCDate()
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
    finnhubQ.push(action)
}