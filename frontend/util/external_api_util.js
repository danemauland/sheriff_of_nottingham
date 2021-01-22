import { DAILY_RESOLUTION, WEEKLY_RESOLUTION } from "../actions/external_api_actions";
import { getStartTime, getEndTime } from "./dashboard_calcs";

const alphaAPIKey = window.alphavantageAPIKey;
const finnAPIKey = window.finnhubAPIKey;
const polygonAPIKey = window.polygonAPIKey;

const genAjax = (url, method = "GET") => $.ajax({url, method});

const getParamStr = params => (
    Object.entries(params).map(param => `${param[0]}=${param[1]}`).join("&")
)

const getAVUrl = params => {
    params.apikey = alphaAPIKey;
    return `https://www.alphavantage.co/query?${getParamStr(params)}`;
}

const getPolygonUrl = ticker => {
    const urlStart = "https://api.polygon.io/v1/meta/symbols/";
    const params = {apiKey: polygonAPIKey};
    return `${urlStart}${ticker}/company?${getParamStr(params)}`;
}

const getFinnUrl = (type, params) => {
    params.token = finnAPIKey;
    const urlStart = `https://finnhub.io/api/v1/${type}?`;
    return `${urlStart}${getParamStr(params)}`;
}

export const fetchCandles = (ticker, resolution, from, to) => {
    const params = {
        symbol: ticker,
        resolution,
        from,
        to,
    };
    return genAjax(getFinnUrl("stock/candle", params));
}

export const fetchOneDayPrices = ticker => {
    const params = {
        symbol: ticker,
        resolution: DAILY_RESOLUTION,
        from: Date.parse(getStartTime()) / 1000,
        to: Date.parse(getEndTime()) / 1000,
    };
    return genAjax(getFinnUrl("stock/candle", params));
}

export const fetchCompanyNews = (ticker, from, to) => {
    const params = {
        symbol: ticker,
        from,
        to,
    };
    return genAjax(getFinnUrl("company-news", params));
}

export const fetchMarketNews = (from, to) => {
    const params = {
        category: "general",
        from,
        to,
    }
    return genAjax(getFinnUrl("news", params));
};

export const fetchCompanyOverview = ticker => {
    const params = {
        function: "OVERVIEW",
        symbol: ticker,
    }
    return genAjax(getAVUrl(params));
};

export const fetchTickerData = ticker => genAjax(getPolygonUrl(ticker));

export const fetchIntradayPrices = ticker => {
    const params = {
        function: "TIME_SERIES_INTRADAY_EXTENDED",
        symbol: ticker,
        interval: `${WEEKLY_RESOLUTION}min`,
        outputsize: "full",
    };
    return genAjax(getAVUrl(params));
};

export const fetchDailyPrices = ticker => {
    const params = {
        function: "TIME_SERIES_DAILY_ADJUSTED",
        symbol: ticker,
        outputsize: "full",
    };
    return genAjax(getAVUrl(params));
};