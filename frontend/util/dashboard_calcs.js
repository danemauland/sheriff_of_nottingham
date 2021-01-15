export const ONE_DAY = "ONE_DAY";
export const ONE_WEEK = "ONE_WEEK";
export const ONE_MONTH = "ONE_MONTH";
export const THREE_MONTH = "THREE_MONTH";
export const ONE_YEAR = "ONE_YEAR";
export const ONE_MONTH_OFFSET = 31;
export const THREE_MONTH_OFFSET = 91;
const DIGIT_STRINGS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const formatToDollar = (num, numDecimals = 2) => {
    if ((typeof num) !== "number") return false;
    
    const fractionDigits = Math.max(0, numDecimals);
    const localeOptions = {
        minimumFractionDigits: fractionDigits,
        maximimFractionDigits: fractionDigits,
    }

    num /= 100;
    
    num = num.toLocaleString(undefined, localeOptions);

    if (numDecimals === 0) num += ".";
    
    return "$" + num;
}

export const portfolioValue = state => {
    return state.newEntities.portfolioHistory.valuationHistory.valuations.oneDay.last();
}

export const isStockLoaded = (
    ticker,
    {tickers, candlePrices, tickerData, companyOverviews}
) => (
    tickers.has(ticker) &&
    Object.values(candlePrices).every(prices => prices[ticker]) &&
    tickerData[ticker] &&
    companyOverviews[ticker]
);

export const formatCityAndState = address => {
    const firstComma = address.indexOf(",");
    const secondComma = address.slice(firstComma + 1).indexOf(",") + firstComma + 1;
    let state = address.slice(secondComma + 2, secondComma + 4);
    state = states[state];
    return address.slice(firstComma + 2, secondComma + 2) + state;
}

export const formatLargeNumber = (num, numDecimals = 2) => {
    num = parseInt(num)
    const suffixes = ["", "K", "M", "B", "T", "QD"]
    let i = 0;
    while (num > 999) {
        i++;
        num /= 1000
    }
    return num.toFixed(numDecimals) + suffixes[i];
}

export const formatPERatio = ratio => {
    if (ratio === "None") return "–";
    return parseFloat(ratio).toFixed(2);
}

export const formatDividendYield = dYield => {
    return (dYield === "0" ? "–" : (parseFloat(dYield) * 100).toFixed(2))
}

export const pricesAreLoaded = (tickers, prices) => {
    tickers = Array.convert(tickers);

    prices = Object.values(prices);
    
    return tickers.every(ticker => prices.every(price => price[ticker]));
}

export const tradedPricesAreLoaded = (
    {tickers, trades, candlePrices}
) => {
    tickers = Array.convert(tickers);
    const ownedTickers = getTradedTickers(tickers, trades);
    return pricesAreLoaded(ownedTickers, candlePrices);
}

const getTradedTickers = (tickers, trades) => {
    tickers = Array.convert(tickers);
    return tickers.filter(ticker => tickerWasTraded(ticker, trades));
}

const tickerWasTraded = (ticker, trades) => {
    return trades[ticker] && trades[ticker].length > 0;
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

export const getPreviousEndingValue = function(oneYearValues, type) {
    switch (type) {
        case ONE_DAY:
            return oneYearValues[oneYearValues.length - 2];
        case ONE_WEEK:
            return oneYearValues[oneYearValues.length - 8];
        case ONE_MONTH:
            return oneYearValues[oneYearValues.length - ONE_MONTH_OFFSET];
        case THREE_MONTH:
            return oneYearValues[oneYearValues.length - THREE_MONTH_OFFSET];
        case ONE_YEAR:
            return oneYearValues[0];
        default:
            break;
    }
}

export const assetIsInitialized = (ticker, tickers) => tickers.has(ticker);

export const companyOverviewIsLoaded = (ticker, companyOverviews) => (
    !!companyOverviews[ticker]
);

export const tickerDataIsLoaded = (ticker, tickerData) => !!tickerData[ticker];

export const getCutoffDescription = desc => {
    const cutoffIndex = desc.slice(160).indexOf(".") + 161;
    
    return desc.slice(0,cutoffIndex);
};

export const formatPercentage = num => {
    const sign = (num < 0 ? "-" : "+");
    return sign + Math.abs(num * 100).toFixed(2) + "%";
}

export const parseDollarInput = val => {
    let numDecimals = -1;
    let numStr = "";

    for(let char of val) {
        const charIsDecimal = char === ".";

        const charIsValid = DIGIT_STRINGS.includes(char) || charIsDecimal;
        const digitIsValid = numDecimals === -1 || !charIsDecimal;

        if (charIsValid && digitIsValid) {
            numStr += char;

            const numDecIs0or1 = (numDecimals > -1 && numDecimals < 2);
            if (numDecIs0or1 || charIsDecimal) numDecimals++;
        }
    }

    let amount = "";
    if (numStr !== "$" && numStr !== "") {
        amount = Math.floor(parseFloat(numStr) * 100);
    }

    return {amount, numDecimals}
}

export const parseIntegerInput = val => {
    let numStr = "";

    for(let char of val) if (DIGIT_STRINGS.includes(char)) numStr += char;;

    return parseInt(numStr) || "";
}