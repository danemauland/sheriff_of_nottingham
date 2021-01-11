import {
    getPreviousEndingValue,
    ONE_DAY
} from "./dashboard_calcs";

const getNewEntities = state => state.newEntities;

const getAssetInformation = state => getNewEntities(state).assetInformation;

const getCandlePrices = state => getAssetInformation(state).candlePrices;

const getOneDayCandlePrices = state => getCandlePrices(state).oneDay;

const getTickerOneDayCandlePrices = (state, ticker) => (
    getOneDayCandlePrices(state)[ticker]
);

const getAssetValuations = state => getAssetInformation(state).valuations;

const getOwnershipHistories = state => (
    getAssetInformation(state).ownershipHistories
);

const getSharesHistory = state => getOwnershipHistories(state).numShares;

const getPosSharesHistory = (ticker, state) => getSharesHistory(state)[ticker];

const getOneDayPortfolioValuations = state => (
    getPortfolioValuations(state).oneDay
);

const getOneDayAssetValuations = state => getAssetValuations(state).oneDay;

const getOneYearAssetValuations = state => getAssetValuations(state).oneYear;

const getPosOneDayValuations = (ticker, state) => (
    getOneDayAssetValuations(state)[ticker]
);

const getPosOneYearValuations = (ticker, state) => (
    getOneYearAssetValuations(state)[ticker]
);

const getPosCosts = state => getAssetInformation(state).positionCosts;

const getPortfolioHistory = state => getNewEntities(state).portfolioHistory;

const getCashHistory = state => getPortfolioHistory(state).cashHistory;

const getValuationHistory = state =>getPortfolioHistory(state).valuationHistory;

const getCashBalances = state => getCashHistory(state).balances;

const getCashTimes = state => getCashHistory(state).times;

const getUI = state => state.ui;

export const getPosMarketValue = (ticker, state) => (
    getPosOneDayValuations(ticker, state).last()
);

export const getSharesOwned = (ticker, state) => (
    getPosSharesHistory(ticker, state).last()
);

export const getPosCost = (ticker, state) => getPosCosts(state)[ticker];

export const getPrevDayClose = (ticker, state) => (
    getPreviousEndingValue(getPosOneYearValuations(ticker, state), ONE_DAY)
);

export const getPortfolioValue = state => (
    getOneDayPortfolioValuations(state).last()
);

export const getStartingCashBal = state => getCashBalances(state)[0];

export const getStartingCashTime = state => getCashTimes(state)[0];

export const getCashBalance = state => getCashBalances(state).last();

export const getPortfolioValuations = state => (
    getValuationHistory(state).valuations
);

export const getPortfolioValuationsTimes = state => (
    getValuationHistory(state).times
);

export const getValueIncreased = state => getUI(state).valueIncreased;

export const getMarketNews = state => getNewEntities(state).marketNews;

export const getLastPrice = (state, ticker) => (
    getTickerOneDayCandlePrices(state, ticker).last()
);

const getSession = state => state.session;

export const getUsername = state => getSession(state).username;

export const getAssetTrades = state => getAssetInformation(state).trades;