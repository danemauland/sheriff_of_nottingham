import {
    getPreviousEndingValue,
    ONE_DAY
} from "./dashboard_calcs";

const getNewEntities = state => state.newEntities;

const getAssetInformation = state => getNewEntities(state).assetInformation;

const getAssetValuations = state => getAssetInformation(state).valuations;

const getOneDayAssetValuations = state => getAssetValuations(state).oneDay;

export const getPosMarketValue = (ticker, state) => (
    getOneDayAssetValuations(state)[ticker].last()
);

export const getSharesOwned = (ticker, {newEntities}) => (
    newEntities.assetInformation.ownershipHistories.numShares[ticker].last()
);

export const getPosCost = (ticker, {newEntities}) => (
    newEntities.assetInformation.positionCosts[ticker]
);

export const getPrevDayClose = (ticker, {newEntities: {assetInformation}}) => (
    getPreviousEndingValue(assetInformation.valuations.oneYear[ticker], ONE_DAY)
);

export const getPortfolioValue = (state) => (
    getPortfolioValuations(state).oneDay.last()
);

export const getStartingCashBal = ({newEntities}) => (
    newEntities.portfolioHistory.cashHistory.balances[0]
);

export const getStartingCashTime = ({newEntities}) => (
    newEntities.portfolioHistory.cashHistory.times[0]
);

export const getPortfolioValuations = ({newEntities}) => (
    newEntities.portfolioHistory.valuationHistory.valuations
);

export const getPortfolioValuationsTimes = ({newEntities}) => (
    newEntities.portfolioHistory.valuationHistory.times
);

export const getValueIncreased = (state) => (
    state.ui.valueIncreased
);