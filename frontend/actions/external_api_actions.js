import * as externalAPIUtil from "../util/external_api_util"
const queue = require("async/queue");
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = window.finnhubAPIKey;
const finnhubClient = new finnhub.DefaultApi()

export const FETCH_CANDLES = "FETCH_CANDLES";
export const FETCH_QUOTE = "FETCH_QUOTE";
export const FETCH_COMPANY_OVERVIEW = "FETCH_COMPANY_OVERVIEW";
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

const q = action => {
    console.log(action);
    if (action === null) debugger;
    switch (action.type) {
        case FETCH_CANDLES:
            finnhubClient.stockCandles(action.ticker, action.resolution, action.start, action.end, {}, (error, data, response) => {
                console.log(error);
                action.dispatch(receiveCandles(action.ticker, data, action.subtype))
            })
            break;
        case FETCH_QUOTE:
            finnhubClient.quote(action.ticker, (error, data, response) => {
                action.dispatch(receiveQuote(action.ticker, data))
            })
            break;
        case FETCH_COMPANY_OVERVIEW:
            externalAPIUtil.fetchCompanyOverview(action.ticker).then(
                companyOverview => dispatch(receiveCompanyOverview(action.ticker, companyOverview))
            )
        default:
            break;
    }
}

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
    console.log(action);
    q({...action})
}

export const fetchQuote = ticker => dispatch => {
    const action = {
        type: FETCH_QUOTE,
        ticker,
        dispatch,
    }
    q({...action});
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
    q({...action});
}