const apiKey = window.alphaVantageAPIKey;

export const fetchCompanyOverview = ticker => (
    $.ajax({
        url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`,
        method: "GET",
    })
)