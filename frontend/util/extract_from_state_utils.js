import {
    getPreviousEndingValue,
    ONE_DAY,
    formatCityAndState,
    formatLargeNumber,
    formatToDollar,
    formatDividendYield,
    formatPERatio,
} from "./dashboard_calcs";

const getNewEntities = state => state.newEntities;

export const getAssetInformation = state => (
    getNewEntities(state).assetInformation
);

export const getTickers = state => getAssetInformation(state).tickers;

const getTradesByAsset = state => getAssetInformation(state).trades;

export const getOwnedTickers = state => (
    Array.from(getTickers(state)).filter(ticker => tickerIsOwned(state, ticker))
);

const getPrices = state => getAssetInformation(state).prices;

const getOneDayPrices = state => getPrices(state).oneDay;

const getTickerOneDayPrices = (state, ticker) => (
    getOneDayPrices(state)[ticker]
);

const getOneWeekPrices = state => getPrices(state).oneWeek;

const getOneMonthPrices = state => getPrices(state).oneMonth;

const getThreeMonthPrices = state => getPrices(state).threeMonth;

const getTickerOneWeekPrices = (state, ticker) => (
    getOneWeekPrices(state)[ticker]
);

const getTickerOneMonthPrices = (state, ticker) => (
    getOneMonthPrices(state)[ticker]
);

const getTickerThreeMonthPrices = (state, ticker) => (
    getThreeMonthPrices(state)[ticker]
);

const getOneYearPrices = state => getPrices(state).oneYear;

const getTickerOneYearPrices = (state, ticker) => (
    getOneYearPrices(state)[ticker]
);

export const getAllTickerPrices = (state, ticker) => ({
    oneDay: getTickerOneDayPrices(state, ticker),
    oneWeek: getTickerOneWeekPrices(state, ticker),
    oneMonth: getTickerOneMonthPrices(state, ticker),
    threeMonth: getTickerThreeMonthPrices(state, ticker),
    oneYear: getTickerOneYearPrices(state, ticker),
})

const getAssetValuations = state => getAssetInformation(state).valuations;

const getOwnershipHistories = state => (
    getAssetInformation(state).ownershipHistories
);

const getSharesHistory = state => getOwnershipHistories(state).numShares;

const getPosSharesHistory = (state, ticker) => getSharesHistory(state)[ticker];

const getOneDayPortfolioValuations = state => (
    getPortfolioValuations(state).oneDay
);

const getOneDayAssetValuations = state => getAssetValuations(state).oneDay;

const getOneYearAssetValuations = state => getAssetValuations(state).oneYear;

const getPosOneDayValuations = (state, ticker) => (
    getOneDayAssetValuations(state)[ticker]
);

const getPosOneYearValuations = (state, ticker) => (
    getOneYearAssetValuations(state)[ticker]
);

const getPosCosts = state => getAssetInformation(state).positionCosts;

const getPortfolioHistory = state => getNewEntities(state).portfolioHistory;

const getCashHistory = state => getPortfolioHistory(state).cashHistory;

export const getPortfolioValuations = state =>getPortfolioHistory(state).valuations;

const getCashBalances = state => getCashHistory(state).balances;

const getCashTimes = state => getCashHistory(state).times;

const getUI = state => state.ui;

export const getPosMarketValue = (state, ticker) => (
    getPosOneDayValuations(state, ticker).last()
);

export const getSharesOwned = (state, ticker) => (
    getPosSharesHistory(state, ticker).last()
);

export const getPosCost = (state, ticker) => getPosCosts(state)[ticker];

export const getPrevDayValuation = (state, ticker) => (
    getPreviousEndingValue(getPosOneYearValuations(state, ticker), ONE_DAY)
);

export const getPortfolioValue = state => (
    getOneDayPortfolioValuations(state).last()
);

export const getStartingCashBal = state => getCashBalances(state)[0];

export const getStartingCashTime = state => getCashTimes(state)[0];

export const getCashBalance = state => getCashBalances(state).last();

export const getValueIncreased = state => getUI(state).valueIncreased;

export const getMarketNews = state => getNewEntities(state).marketNews;

export const getLastPrice = (state, ticker) => (
    getTickerOneDayPrices(state, ticker).last()
);

const getSession = state => state.session;

export const getUsername = state => getSession(state).username;

const getCompanyOverviews = state=> getAssetInformation(state).companyOverviews;

const getCompanyOverview = (state,ticker) => getCompanyOverviews(state)[ticker];

const getNames = state => getAssetInformation(state).names;

export const getName = (state, ticker) => getNames(state)[ticker];

const getDescriptions = state => getAssetInformation(state).descriptions;

export const getDescription = (state, ticker) => getDescriptions(state)[ticker];

const getTickerData = state => getAssetInformation(state).tickerData;

const getAssetTickerData = (state, ticker) => getTickerData(state)[ticker];

const getHistoricPrices = state => getAssetInformation(state).historicPrices;

const getPrevVolume = state => getAssetInformation(state).prevVolume;

const getPrevTickerVolume = (state, ticker) => getPrevVolume(state)[ticker];

const getOneDayHighs = state => getHistoricPrices(state).oneDayHigh;

const getOneDayHigh = (state, ticker) => getOneDayHighs(state)[ticker];

const getOneDayLows = state => getHistoricPrices(state).oneDayLow;

const getOneDayLow = (state, ticker) => getOneDayLows(state)[ticker];

const getOneDayOpens = state => getHistoricPrices(state).oneDayOpen;

const getOneDayOpen = (state, ticker) => getOneDayOpens(state)[ticker];

const getCurVolumes = state => getAssetInformation(state).curVolume;

const getCurVolume = (state, ticker) => getCurVolumes(state)[ticker];

const getOneYearHighs = state => getHistoricPrices(state).oneYearHigh;

const getOneYearHigh = (state, ticker) => getOneYearHighs(state)[ticker];

const getOneYearLows = state => getHistoricPrices(state).oneYearLow;

const getOneYearLow = (state, ticker) => getOneYearLows(state)[ticker];

const getAllCompanyNews = state => getAssetInformation(state).companyNews;

export const getCompanyNews = (state,ticker) =>getAllCompanyNews(state)[ticker];

const getCEOs = state => getAssetInformation(state).ceos;

const getCEO = (state, ticker) => getCEOs(state)[ticker];

const getAllAboutItems = (state) => getAssetInformation(state).aboutItems;

const getAboutItems = (state, ticker) => getAllAboutItems(state)[ticker];

export const formatAboutItems = (state, ticker) => (
    Array.from(getAboutItems(state, ticker).entries())
);

export const getAPIDebounceStartTime = state=>getUI(state).apiDebounceStartTime;

export const getSecondsToNextAPIPull = state => {
    const startDateTime = getAPIDebounceStartTime(state);
    if (!startDateTime) return;

    const endTime = startDateTime.getTime() / 1000 + 60;
    const now = (new Date().getTime()) / 1000;

    return Math.ceil(endTime - now);
}

export const getModal = state => getUI(state).modal;

export const tickerIsOwned = (state, ticker) => {
    const sharesHistory = getPosSharesHistory(state, ticker);
    return sharesHistory && sharesHistory.last() !== 0;
}

const getPrevDayClose = (state, ticker) => (
    getPreviousEndingValue(getTickerOneYearPrices(state, ticker), ONE_DAY)
);

export const getDayPercentChange = (state, ticker) => (
    (getLastPrice(state, ticker) / getPrevDayClose(state, ticker)) - 1
);

export const getTimes = state => (
    getNewEntities(state).times
);

export const getStartPrices = (state, ticker) => {
    const allStartPrices = getAllStartPrices(state);
    return {
        oneDay: allStartPrices.oneDay[ticker],
        oneWeek: allStartPrices.oneWeek[ticker],
        oneMonth: allStartPrices.oneMonth[ticker],
        threeMonth: allStartPrices.threeMonth[ticker],
        oneYear: allStartPrices.oneYear[ticker],
    }
}

const getAllStartPrices = state => getAssetInformation(state).startPrices;

export const getStartValuations = state => (
    getPortfolioHistory(state).startValuations
);