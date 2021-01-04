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

export const ONE_DAY = "ONE_DAY";
export const ONE_WEEK = "ONE_WEEK";
export const ONE_MONTH = "ONE_MONTH";
export const THREE_MONTH = "THREE_MONTH";
export const ONE_YEAR = "ONE_YEAR";

export const tickerIsOwned = (ticker, ownershipHistoryShares) => (
    ownershipHistoryShares && ownershipHistoryShares.last() !== 0
)

export const positionValue = (ticker, state) => {
    return state.entities.displayedAssets[ticker].valueHistory.oneDay.last();
}

export const positionCost = (ticker, state) => {
    let sharesRemaining = state.entities.assetInformation.ownershipHistories.numShares.last();
    let short = false;
    if (sharesRemaining < 0) {
        short = true;
        sharesRemaining *= -1;
    }
    let cost = 0;
    let i = state.entities.trades.length - 1;
    while (sharesRemaining > 0) {
        let trade = state.entities.trades[i]
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
    return state.entities.summary.valueHistory.values.oneDay.last();
}

export const isStockLoaded = (ticker, state) => {
    if (state.entities.displayedAssets[ticker] === undefined ||
        state.entities.displayedAssets[ticker].prices === undefined ||
        state.entities.displayedAssets[ticker].prices.oneDay === undefined ||
        state.entities.displayedAssets[ticker].prices.oneWeek === undefined ||
        state.entities.displayedAssets[ticker].prices.oneYear === undefined ||
        state.entities.displayedAssets[ticker].companyOverview === undefined ||
        state.entities.displayedAssets[ticker].tickerData === undefined ||
        state.entities.displayedAssets[ticker].companyNews === undefined
    ) { return false }
    return true;
}

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

export const extractAboutItems = (ticker, state) => {
    const asset = state.entities.displayedAssets[ticker];
    const desc = asset.companyOverview;
    const data = asset.tickerData;
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
    items.push(["Prev. Day Volume", formatLargeNumber(asset.prevVolume)]);
    items.push(["High Today", formatToDollar(asset.prices.oneDayHigh)]);
    items.push(["Low Today", formatToDollar(asset.prices.oneDayLow)]);
    items.push(["Open Price", formatToDollar(asset.prices.open)]);
    items.push(["Volume", formatLargeNumber(asset.curVolume)]);
    items.push(["52 Week High", formatToDollar(asset.prices.oneYearHigh)]);
    items.push(["52 Week Low", formatToDollar(asset.prices.oneYearLow)]);

    return items
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