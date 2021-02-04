import {
    defaultState,
    getCashHistoy,
    getOwnershipHistories,
    getTradesByTicker,
    calcPositionCosts,
    sortOrder,
} from "./new_entities_util";
var merge = require('lodash.merge');

export default user => {

    if (!user) return undefined;


    // trades/cash transactions are received in the order they were added to
    // the database, so back-dated transactions will be out of order
    const trades = [...user.trades].sort(sortOrder);
    const cashTransactions = [...user.cashTransactions].sort(sortOrder);

    // convertTimestampsToSeconds(trades);
    // convertTimestampsToSeconds(cashTransactions);

    // calculates stocks owned at any given point in time based off the trades
    const ownershipHistories = getOwnershipHistories(trades);

    const tradesByTicker = getTradesByTicker(trades);
    
    const numShares = ownershipHistories.numShares;
    const tickers = new Set(Object.keys(numShares));

    const positionCosts = calcPositionCosts(tickers, tradesByTicker, numShares);

    // calculates the cash balance at any given time based off deposits/
    // withdrawals and cash spent on trades
    const cashHistory = getCashHistoy(cashTransactions, trades);

    let newEntities = {
        assetInformation: {
            tickers,
            ownershipHistories,
            trades: tradesByTicker,
            positionCosts,
        },
        portfolioHistory: {
            cashTransactions,
            cashHistory,
            trades,
        },
    };

    // adds in all default newEnities keys to newEntities object
    newEntities = merge({}, defaultState, newEntities);

    const preloadedState = {
        session: {
            username: user.username,
        },
        newEntities,
    }

    return preloadedState;
}