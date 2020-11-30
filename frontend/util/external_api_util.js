const alphaAPIKey = window.alphavantageAPIKey;
const finnAPIKey = window.finnhubAPIKey;
const polygonAPIKey = window.polygonAPIKey;

export const fetchCompanyOverview = ticker => {
    console.log(alphaAPIKey)
    console.log("HERE")
    return (
    $.ajax({
        url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${alphaAPIKey}`,
        method: "GET",
    })
)}

export const fetchCandles = (ticker, resolution, from, to) => (
    $.ajax({
        url: `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}&token=${finnAPIKey}`,
        method: "GET",
    })
)

export const fetchTickerData = ticker => (
    $.ajax({
        url: `https://api.polygon.io/v1/meta/symbols/${ticker}/company?apiKey=${polygonAPIKey}`,
        method: "GET",
    })
)

export const fetchCompanyNews = (ticker, from, to) => (
    $.ajax({
        url: `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${finnAPIKey}`,
        method: "GET",
    })
)

export const fetchMarketNews = (from, to) => (
    $.ajax({
        url: `https://finnhub.io/api/v1/news?category=general&from=${from}&to=${to}&token=${finnAPIKey}`,
        method: "GET",
    })
)