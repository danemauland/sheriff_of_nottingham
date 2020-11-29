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

export const tickerIsOwned = (ticker, state) => {
    if (state.entities.displayedAssets[ticker] &&
        state.entities.displayedAssets[ticker].ownershipHistory &&
        state.entities.displayedAssets[ticker].ownershipHistory.numShares && 
        state.entities.displayedAssets[ticker].ownershipHistory.numShares.length > 0 &&
        state.entities.displayedAssets[ticker].ownershipHistory.numShares.last() !== 0
        ) {
            return true;
    }
    return false;
}

export const positionValue = (ticker, state) => {
    return state.entities.displayedAssets[ticker].valueHistory.oneDay.last();
}

export const numSharesOwned = (ticker, state) => {
    return state.entities.displayedAssets[ticker].ownershipHistory.numShares.last();
}

export const positionCost = (ticker, state) => {
    let sharesRemaining = numSharesOwned(ticker, state);
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