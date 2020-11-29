const alphaAPIKey = window.alphaVantageAPIKey;
const finnAPIKey = window.finnhubAPIKey;

export const fetchCompanyOverview = ticker => (
    $.ajax({
        url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${alphaAPIKey}`,
        method: "GET",
    })
)

export const fetchCandles = (ticker, resolution, from, to) => (
    $.ajax({
        url: `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}&token=${finnAPIKey}`,
        method: "GET",
    })
)