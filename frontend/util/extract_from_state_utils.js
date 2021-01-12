import {
    getPreviousEndingValue,
    ONE_DAY,
    formatCityAndState,
    formatLargeNumber,
    formatToDollar,
    formatDividendYield,
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

const getCompanyOverviews = state=> getAssetInformation(state).companyOverviews;

const getCompanyOverview = (state,ticker) => getCompanyOverviews(state)[ticker];

export const getDescription = (state, ticker) => (
    getCompanyOverview(state, ticker).Description
);

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

const getAllCompanyNews = state => getAssetInformation(state);

export const getCompanyNews = (state,ticker) =>getAllCompanyNews(state)[ticker];

export const getAboutItems = (state, ticker) => {
    const {
        MarketCapitalization, Address, PERatio, DividendYield
    } = getCompanyOverview(state, ticker);
    const data = getAssetTickerData(state, ticker);
    const items = [];

    if (data) {
        const {ceo, employees, listdate} = data;
        items.push(["CEO", ceo]);
        items.push(["Employees", parseInt(employees).toLocaleString()]);
        items.push(["Listed", listdate.slice(0,4)]);
    } else {
        items.push(["CEO","Not Found"]);
        items.push(["Employees", "Not Found"]);
        items.push(["Listed", "Not Found"]);
    }
    
    items.push(["Market Cap", formatLargeNumber(MarketCapitalization, 3)]);
    items.push(["Headquarters", formatCityAndState(Address)]);
    items.push(["Price-Earnings Ratio", parseFloat(PERatio).toFixed(2)]);
    items.push(["Dividend Yield", formatDividendYield(DividendYield)]);
    
    const prevVol = getPrevTickerVolume(state, ticker);
    items.push(["Prev. Day Volume", formatLargeNumber(prevVol)]);

    items.push(["High Today", formatToDollar(getOneDayHigh(state, ticker))]);
    items.push(["Low Today", formatToDollar(getOneDayLow(state, ticker))]);
    items.push(["Open Price", formatToDollar(getOneDayOpen(state, ticker))]);
    items.push(["Volume", formatLargeNumber(getCurVolume(state, ticker))]);
    items.push(["52 Week High", formatToDollar(getOneYearHigh(state, ticker))]);
    items.push(["52 Week Low", formatToDollar(getOneYearLow(state, ticker))]);

    return items;
}