import {
    RECEIVE_QUOTE,
    INITIALIZE_ASSET,
    RECEIVE_COMPANY_NEWS,
    FLUSH_ASSET,
    RECEIVE_MARKET_NEWS,
    RECEIVE_INTRADAY_PRICES,
    RECEIVE_ONE_DAY_PRICES,
    RECEIVE_DAILY_PRICES,
    RECEIVE_ABOUT_ITEMS,
    RECEIVE_COMPANY_NAME,
    RECEIVE_COMPANY_DESCRIPTION,
} from "../actions/external_api_actions";
import {
    REMOVE_CASH_TRANSACTIONS,
    RECEIVE_CASH_TRANSACTION,
} from "../actions/cash_transactions_actions";
import {
    RECEIVE_TRADE,
} from "../actions/trade_actions";
import {
    LOGOUT_CURRENT_USER, RECEIVE_CURRENT_USER
} from "../actions/session_actions";
import {
    defaultState,
    // setTimesAndPrices,
    updateStockValuations,
    updatePortfolioValuations,
    // setIntradayTimesAndPrices,
    // setOneDayTimesAndPrices,
    // setDailyTimesAndPrices,
    newDefaultAboutItems,
    getCashHistoy,
    sortOrder,
    getOwnershipHistories,
    getTradesByTicker,
    calcPositionCosts,
    updateStockValuationsForTicker,
} from "../util/new_entities_util";
import generateStateFromUser from "../util/preloaded_state_util.js";
var merge = require('lodash.merge');

export default (state = defaultState, action) => {
    Object.freeze(state);
    let newState, assetInformation, portfolioHistory, times;
    switch (action.type) {
        case RECEIVE_CURRENT_USER: 
            newState = generateStateFromUser(action.user).newEntities;
            return newState;

        case REMOVE_CASH_TRANSACTIONS:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            portfolioHistory.cashTransactions = [];
            portfolioHistory.cashHistory = getCashHistoy([], portfolioHistory.trades);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case RECEIVE_CASH_TRANSACTION:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            portfolioHistory.cashTransactions = [...portfolioHistory.cashTransactions, action.cashTransaction];
            portfolioHistory.cashTransactions.sort(sortOrder);
            portfolioHistory.cashHistory = getCashHistoy([...portfolioHistory.cashTransactions], portfolioHistory.trades);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case RECEIVE_TRADE:
            newState = merge({}, state);
            const tickers = newState.assetInformation.tickers;
            if (!tickers.has(action.trade.ticker)) tickers.add(action.trade.ticker);
            let trades = newState.portfolioHistory.trades;
            trades.push(action.trade);
            trades = trades.sort((a, b) => a.createdAt - b.createdAt);
            newState.portfolioHistory.trades = trades;
            newState.assetInformation.ownershipHistories = getOwnershipHistories(trades);
            newState.assetInformation.trades = getTradesByTicker(trades);
            newState.assetInformation.positionCosts = calcPositionCosts(tickers, newState.assetInformation.trades, newState.assetInformation.ownershipHistories.numShares);
            newState.portfolioHistory.cashHistory = getCashHistoy(newState.portfolioHistory.cashTransactions, trades);
            updateStockValuationsForTicker(action, newState.assetInformation, newState.times);
            updatePortfolioValuations(
                newState.assetInformation,
                newState.portfolioHistory,
                newState.times
            );
            return newState;

        case RECEIVE_ABOUT_ITEMS:
            const ticker = action.ticker;
            newState = merge({}, state);
            newState.assetInformation.aboutItems[ticker] ||= newDefaultAboutItems();
            const aboutItems = newState.assetInformation.aboutItems[ticker];
            for(let item of action.items) {
                aboutItems.set(item[0], item[1]);
            }
            return newState;

        case RECEIVE_COMPANY_NAME:
            newState = merge({}, state);
            newState.assetInformation.names[action.ticker] = action.name;
            return newState;

        case RECEIVE_COMPANY_DESCRIPTION:
            newState = merge({}, state);
            newState.assetInformation.descriptions[action.ticker] = action.description;
            return newState;

        case RECEIVE_INTRADAY_PRICES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            merge(assetInformation.prices, action.prices);
            Object.assign(times, action.times);
            merge(assetInformation.startPrices, action.startPrices);
            // setIntradayTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case RECEIVE_ONE_DAY_PRICES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            merge(assetInformation.prices, action.prices);
            Object.assign(times, action.times);
            // setOneDayTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case RECEIVE_DAILY_PRICES:
            newState = merge({}, state);
            ({assetInformation, portfolioHistory, times} = newState);
            merge(assetInformation.prices, action.prices);
            merge(assetInformation.startPrices, action.startPrices);
            Object.assign(times, action.times);
            // setDailyTimesAndPrices(action, assetInformation, times);
            updateStockValuations(action, assetInformation, times);
            updatePortfolioValuations(
                assetInformation,
                portfolioHistory,
                times
            );
            return newState;

        case INITIALIZE_ASSET:
            newState = merge({}, state);
            
            newState.assetInformation.tickers.add(action.ticker);

            return newState;

        case RECEIVE_MARKET_NEWS:
            newState = Object.assign({}, state, {marketNews: action.marketNews})

            return newState;

        case FLUSH_ASSET:
            // TODO: ITERATE THROUGH OTHER AREAS AND REMOVE TICKER
            newState = merge({}, state);
        
            // Needed since merge does not create new set objects
            newState.assetInformation.tickers = new Set(newState.assetInformation.tickers);

            newState.assetInformation.tickers.delete(action.ticker);
            return newState;

        case LOGOUT_CURRENT_USER:
            return defaultState;

        case RECEIVE_QUOTE:
            newState = {...state};

            newState.assetInformation.currentPrices[action.ticker] = Math.floor(100*action.quote.c);

            return newState;

        case RECEIVE_COMPANY_NEWS:
            newState = {...state};

            newState.assetInformation.companyNews[action.ticker] = action.companyNews;

            return newState;

        default:
            return state;
    }
}