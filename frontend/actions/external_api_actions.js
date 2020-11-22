const queue = require("async/queue");
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = window.finnhubAPIKey;
const finnhubClient = new finnhub.DefaultApi()

export const FETCH_CANDLES = "FETCH_CANDLES";
export const FETCH_QUOTE = "FETCH_QUOTE";
export const RECEIVE_DAILY_CANDLES = "RECEIVE_DAILY_CANDLES";
export const RECEIVE_WEEKLY_CANDLES = "RECEIVE_WEEKLY_CANDLES";
export const RECEIVE_MONTHLY_CANDLES = "RECEIVE_MONTHLY_CANDLES";
export const RECEIVE_THREE_MONTH_CANDLES = "RECEIVE_THREE_MONTH_CANDLES";
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

const q = queue(action => {
    switch (action.type) {
        case FETCH_CANDLES:
            finnhubClient.stockCandles(action.ticker, action.resolution, action.start, action.end, {}, (error, data, response) => {
                action.dispatch(receiveCandles(action.ticker, data, action.subtype))
            })
            break;
        case FETCH_QUOTE:
            finnhubClient.quote(action.ticker, (error, data, response) => {
                console.log(error);
                action.dispatch(receiveQuote(action.ticker, data))
            })
        default:
            break;
    }
}, 15)

const getStartTime = () => {
    const startTime = new Date();
    const minutes = startTime.getUTCMinutes();
    const hours = startTime.getUTCHours();
    if (hours < 13 || (hours === 10 && minutes < 30)) {
        startTime.setUTCDate(startTime.getUTCDate() - 1);
    }
    startTime.setUTCHours(13);
    startTime.setMinutes(30)
    const day = startTime.day;
    if (day === 6) {startTime.setUTCDate(startTime.getUTCDate() - 1)}
    else if (day === 0) { startTime.setUTCDate(startTime.getUTCDate() - 2)};
    return startTime;
}

const getEndTime = () => {
    const startTime = getStartTime();
    const now = new Date();
    if (now - startTime > (8.5 * 60 * 60 * 1000)) {
        startTime.setUTCHours(22);
        startTime.setMinutes(0);
        return startTime;
    }
    return now;
}

export const fetchCandles = (ticker, subtype = RECEIVE_DAILY_CANDLES) => dispatch => {
    const startTime = getStartTime();
    const endTime = getEndTime();
    let resolution = 5;
    switch (subtype) {
        case RECEIVE_DAILY_CANDLES:
            break;
        case RECEIVE_WEEKLY_CANDLES:
            startTime.setUTCDate(startTime.getUTCDate() - 7);
            resolution = 60;
        case RECEIVE_MONTHLY_CANDLES:
            startTime.setUTCMonth(startTime.getUTCMonth() - 1);
            resolution = "D";
        case RECEIVE_THREE_MONTH_CANDLES:
            startTime.setUTCMonth(startTime.getUTCMonth() - 3);
            resolution = "D";
        case RECEIVE_ANNUAL_CANDLES:
            startTime.setUTCFullYear(startTime.getUTCFullYear() - 1);
            resolution = "D";
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
    q.push(action)
}

export const fetchQuote = ticker => dispatch => {
    const action = {
        type: FETCH_QUOTE,
        ticker,
        dispatch,
    }
    q.push(action);
}

export const initializeAssets = state => ({
    type: INITIALIZE_ASSETS,
    trades: state.entities.trades,
    cashTransactions: state.entities.cashTransactions,
})