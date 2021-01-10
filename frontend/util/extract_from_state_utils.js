import {
    getPreviousEndingValue,
    ONE_DAY
} from "./dashboard_calcs";

export const getPosMarketValue = (ticker, {newEntities}) => (
    newEntities.assetInformation.valuations.oneDay[ticker].last()
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

export const getPortfolioValue = ({newEntities}) => (
    newEntities.portfolioHistory.valuationHistory.valuations.oneDay.last()
);