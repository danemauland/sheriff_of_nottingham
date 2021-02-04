import {formatAboutItems} from "./extract_from_state_utils";

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
    state
) => (
    state.newEntities.assetInformation.tickers.has(ticker) &&
    Object.values(state.newEntities.assetInformation.prices).every(prices => prices[ticker]) &&
    aboutItemsAreLoaded(state, ticker) &&
    state.newEntities.assetInformation.descriptions[ticker]
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
    {tickers, trades, prices}
) => {
    tickers = Array.convert(tickers);
    const tradedTickers = getTradedTickers(tickers, trades);
    return pricesAreLoaded(tradedTickers, prices);
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

export const aboutItemsAreLoaded = (state, ticker) => {
    const aboutItems = formatAboutItems(state, ticker);
    return !aboutItems.some(item => item[1] === null);
}

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

const beforeMarketHours = time => {
    if (typeof time === "number") time = new Date(time * 1000);
    const minutes = time.getUTCHours() * 60 + time.getUTCMinutes();
    const marketOpenHour = (time.isDSTObserved() ? 13 : 14);
    const marketOpenMinutes = marketOpenHour * 60 + 30;
    
    // timeSeries data timestamped at exactly 9:30am is for pre-market
    // trading
    return marketOpenMinutes >= minutes;
}

// daylight savings adjustment made, but it will be wrong for the weekly candles
// if DST changed in the last week
export const getStartTime = timeframe => { 
    const startTime = new Date();
    
    if (beforeMarketHours(startTime)) {
        startTime.setUTCDate(startTime.getUTCDate() - 1);
    }

    const dst = startTime.isDSTObserved();
    startTime.setUTCHours((dst ? 13 : 14));
    
    startTime.setMinutes(30);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    // startTime.setUTCDate(startTime.getUTCDate() - 1); // COMMENT IN ON MARKET CLOSE DAYS

    const day = startTime.getUTCDay();
    if (day === 6) {startTime.setUTCDate(startTime.getUTCDate() - 1)}
    else if (day === 0) { startTime.setUTCDate(startTime.getUTCDate() - 2)};

    switch (timeframe) {
        case ONE_WEEK:
            startTime.setUTCDate(startTime.getUTCDate() - 6);
            break;
    
        case ONE_MONTH:
            startTime.setUTCMonth(startTime.getUTCMonth() - 1);
            break;

        case THREE_MONTH:
            startTime.setUTCMonth(startTime.getUTCMonth() - 3);
            startTime.setUTCDate(startTime.getUTCDate() - 1);
            break;

        case ONE_YEAR:
            startTime.setUTCFullYear(startTime.getUTCFullYear() - 1);
            break;
    }
    
    return startTime;
};

export const camelCase = str => {
    let prevCharWasDash = false;
    let newStr = "";
    for(let char of str) {
        if (char === "-" || char === "_") {
            prevCharWasDash = true;
            continue;
        }

        if (prevCharWasDash) char = char.toUpperCase();
        else char = char.toLowerCase();

        newStr += char;

        prevCharWasDash = false;
    }

    return newStr;
}

export const inMarketHours = (time = Date.parse(new Date()) / 1000) => {
    return !(beforeMarketHours(time) || afterMarketHours(time));
}

const afterMarketHours = time => {
    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const marketCloseHour = getMarketCloseHour(time);

    return hours >= marketCloseHour;
}

export const getMarketCloseHour = time => {
    const date = new Date(time * 1000);
    const dst = date.isDSTObserved();
    
    return (dst ? 20 : 21);
}

export const convertToCents = n => {
    return Math.floor(n * 100)
}

export const getEndTime = () => {
    const startTime = getStartTime();
    const now = new Date();
    if (now - startTime > (6.5 * 60 * 60 * 1000)) {
        startTime.setUTCHours(startTime.getUTCHours() + 7);
        startTime.setMinutes(0);
        return startTime;
    }
    return now;
};

export const cashFormIsOpen = () => !$(".cash-form-div").hasClass("no-height");

export const toggleCashForm = () => {
    $(".cash-form-div").toggleClass("no-height");
    $(".cash-form-div").toggleClass("cash-form-div-expanded");
    $(".cash-container").toggleClass("cash-container-expanded");
    $(".cash-expander-button").toggleClass("cash-button-expanded");
}

export const formatDateTime = function (date, toggleYear) {
    if (typeof date === "number") date = new Date(date * 1000);
    const month = parseMonth(date);
    const day = date.getDate();

    if (toggleYear) return `${month} ${day}, ${date.getFullYear()}`;
    return `${month} ${day}, ${formatTime(date)}`;
}

const MONTHS = [
    "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"
];

export const parseMonth = date => MONTHS[date.getMonth()];

export const formatTime = function(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = (hours > 11 ? "PM" : "AM")

    if (minutes < 10) minutes = `0${minutes}`;
    if (hours > 12) hours = hours % 12;

    return `${hours}:${minutes} ${ampm}`
}