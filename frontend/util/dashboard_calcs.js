export const ONE_DAY = "ONE_DAY";

export const formatToDollar = (num, numDecimals = 2) => {
    if ((typeof num) !== "number") return false;
    let trail = Math.floor(num % 100).toString();
    if (trail.length < 2) trail += "0";
    num = (num / 100).toLocaleString();
    if (numDecimals === 2) {
        if (num[num.length - 2] === ".") {num += trail[1]}
        else if (num[num.length - 3] !== ".") {num += "." + trail};
    } else if (numDecimals === 1) {
        if (num[num.length - 3] === ".") {num = num.slice(0, -1)}
        else if (num[num.length - 2] !== ".") {num += "." + trail[0]}
    } else if (numDecimals === 0) {
        if (num[num.length - 3] === ".") {num = num.slice(0, -3)}
        else if (num[num.length - 2] === ".") {num = num.slice(0, -3)}
    } else if (numDecimals === -1) {
        if (num[num.length - 3] === ".") {num = num.slice(0, -3)}
        else if (num[num.length - 2] === ".") {num = num.slice(0, -3)};
        num += "."
    }
    return "$" + num;
}

export const tickerIsOwned = (ticker, ownershipHistoryShares) => (
    ownershipHistoryShares && ownershipHistoryShares.last() !== 0
)

export const positionValue = (ticker, state) => {
    return state.newEntities.assetInformation.valuations.oneDay[ticker].last();
}

export const positionCost = (ticker, state) => {
    let sharesRemaining = state.newEntities.assetInformation.ownershipHistories.numShares[ticker].last();
    const trades = state.newEntities.portfolioHistory.trades;
    let short = false;
    if (sharesRemaining < 0) {
        short = true;
        sharesRemaining *= -1;
    }
    let cost = 0;
    let i = trades.length - 1;
    while (sharesRemaining > 0) {
        let trade = trades[i];
        if (trade.ticker === ticker) {
            if (short) {
                if (trade.numShares < 0) {
                    if (-trade.numShares < sharesRemaining) {
                        cost += trade.tradePrice * trade.numShares;
                        sharesRemaining += trade.numShares;
                    } else {
                        cost += trade.tradePrice * trade.numShares / sharesRemaining;
                        sharesRemaining = 0;
                    }
                }
            } else {
                if (trade.numShares > 0) {
                    if (trade.numShares < sharesRemaining) {
                        cost += trade.tradePrice * trade.numShares;
                        sharesRemaining -= trade.numShares;
                    } else {
                        cost += trade.tradePrice * trade.numShares / sharesRemaining;
                        sharesRemaining = 0;
                    }
                }
            }
        }
        i--
    }
    return cost;
}

export const portfolioValue = state => {
    return state.newEntities.portfolioHistory.valuationHistory.valuations.oneDay.last();
}

export const isStockLoaded = (
    ticker,
    {tickers, candlePrices, tickerData, companyOverviews}
) => {
    // if (ticker==="AAPL") debugger;
    return (
    tickers.has(ticker) &&
    Object.values(candlePrices).every(prices => prices[ticker]) &&
    tickerData[ticker] &&
    companyOverviews[ticker]
)};

const getCityAndState = address => {
    const firstComma = address.indexOf(",");
    const secondComma = address.slice(firstComma + 1).indexOf(",") + firstComma + 1;
    let state = address.slice(secondComma + 2, secondComma + 4);
    state = states[state];
    return address.slice(firstComma + 2, secondComma + 2) + state;
}

const formatLargeNumber = (num, numDecimals = 2) => {
    num = parseInt(num)
    const suffixes = ["", "K", "M", "B", "T", "QD"]
    let i = 0;
    while (num > 999) {
        i++;
        num /= 1000
    }
    return num.toFixed(numDecimals) + suffixes[i];
}

const formatDividendYield = dYield => {
    return (dYield === "0" ? "–" : parseFloat(dYield).toFixed(2))
}

export const extractAboutItems = (ticker, assetInformation) => {
    const historicPrices = assetInformation.historicPrices;
    const desc = assetInformation.companyOverviews[ticker];
    const data = assetInformation.tickerData[ticker];
    const items = [];
    if (data.length < 1) {
        items.push(["CEO","Not Found"]);
        items.push(["Employees", "Not Found"]);
        items.push(["Listed", "Not Found"]);
    } else {
        items.push(["CEO",data.ceo]);
        items.push(["Employees", parseInt(data.employees).toLocaleString()]);
        items.push(["Listed", data.listdate.slice(0,4)]);items.push(["Market Cap", formatLargeNumber(desc.MarketCapitalization, 3)]);
    }
    items.push(["Headquarters", getCityAndState(desc.Address)]);
    items.push(["Price-Earnings Ratio", parseFloat(desc.PERatio).toFixed(2)]);
    items.push(["Dividend Yield", formatDividendYield(desc.DividendYield)]);
    items.push(["Prev. Day Volume", formatLargeNumber(assetInformation.prevVolume[ticker])]);
    items.push(["High Today", formatToDollar(historicPrices.oneDayHigh[ticker])]);
    items.push(["Low Today", formatToDollar(historicPrices.oneDayLow[ticker])]);
    items.push(["Open Price", formatToDollar(historicPrices.oneDayOpen[ticker])]);
    items.push(["Volume", formatLargeNumber(assetInformation.curVolume[ticker])]);
    items.push(["52 Week High", formatToDollar(historicPrices.oneYearHigh[ticker])]);
    items.push(["52 Week Low", formatToDollar(historicPrices.oneYearLow[ticker])]);

    return items;
}

export const pricesAreLoaded = (tickers, prices) => {
    tickers = Array.convert(tickers);

    prices = Object.values(prices);
    
    return tickers.every(ticker => prices.every(price => price[ticker]));
}

export const ownedPricesAreLoaded = (
    {tickers, ownershipHistories, candlePrices}
) => {
    tickers = Array.convert(tickers);
    const ownedTickers = getOwnedTickers(tickers, ownershipHistories);
    return pricesAreLoaded(ownedTickers, candlePrices);
}

const getOwnedTickers = (tickers, ownershipHistories) => {
    tickers = Array.convert(tickers);
    return tickers.filter(ticker => tickerWasOwned(ticker, ownershipHistories));
}

const tickerWasOwned = (ticker, ownershipHistories) => {
    return (typeof ownershipHistories.numShares[ticker].last()) === "number";
}

const states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

export const assetIsInitialized = (ticker, tickers) => tickers.has(ticker);

export const companyOverviewIsLoaded = (ticker, companyOverviews) => (
    !!companyOverviews[ticker]
)

export const tickerDataIsLoaded = (ticker, tickerData) => !!tickerData[ticker];

export const getCutoffDescription = desc => {
    const cutoffIndex = desc.slice(160).indexOf(".") + 161;
    
    return desc.slice(0,cutoffIndex);
}