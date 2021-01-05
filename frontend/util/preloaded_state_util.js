import {
    defaultState,
    getCashHistoy,
    getOwnershipHistories,
} from "./new_entities_util";
var merge = require('lodash.merge');

export default (user) => {
    if (!user) return undefined;
    const trades = [...user.trades].sort((a, b) => a.createdAt - b.createdAt);
    const cashTransactions = [...user.cashTransactions].sort((a, b) => a.createdAt - b.createdAt);
    const ownershipHistories = getOwnershipHistories(trades);
    const tickers = new Set(Object.keys(ownershipHistories.numShares));
    const cashHistory = getCashHistoy(cashTransactions, trades);
    let newEntities = {
        assetInformation: {
            tickers,
            ownershipHistories,
        },
        portfolioHistory: {
            cashTransactions,
            cashHistory,
            trades,
        },
    };
    newEntities = merge({}, defaultState, newEntities);
    const preloadedState = {
        session: {
            username: user.username,
        },
        newEntities,
    }
    return preloadedState;
}