import React from "react";
import {connect} from "react-redux";
import {
    formatToDollar,
    ONE_DAY,
    portfolioValue,
} from "../../../../util/dashboard_calcs";
import {
    getPreviousEndingValue,
    getStrChange,
} from "../../../../util/chart_utils";
import StockOwnershipBox from "./stock_ownership_box";

const mapStateToProps = (state, {ticker}) => {
    let marketValue = state.newEntities.assetInformation.valuations.oneDay[ticker].last();
    const numShares = state.newEntities.assetInformation.ownershipHistories.numShares[ticker].last();
    const positionCost = state.newEntities.assetInformation.positionCosts[ticker];
    const prevDayCloseValue = getPreviousEndingValue(
        state.newEntities.assetInformation.valuations.oneYear[ticker],
        ONE_DAY
    );
    const averageCost = formatToDollar(positionCost / numShares);
    const positionCostStr = formatToDollar(positionCost);
    const oneDayReturn = getStrChange(prevDayCloseValue, marketValue);
    const totalReturn = getStrChange(positionCost, marketValue);
    const portfolioDiversity = (marketValue / portfolioValue(state) * 100).toFixed(2) + "%";
    const marketValStr = formatToDollar(marketValue);
    return ({
        items: [
            {
                title: "Your Market Value",
                titleVal: marketValStr,
                items: [
                    {title: "Cost", val: positionCostStr},
                    {title: "Today's Return", val: oneDayReturn},
                    {title: "Total Return", val: totalReturn},
                ]
            },
            {
                title: "Your Average Cost",
                titleVal: averageCost,
                items: [
                    {title: "Shares", val: numShares},
                    {title: "Portfolio Diversity", val: portfolioDiversity},
                ]
            },
        ]
    })
}

const StockOwnershipInfo = ({items}) => (
    <div className="stock-ownership-positioner">
        {items.map((item, i) => <StockOwnershipBox key={i} {...item} />)}
    </div>
)

export default connect(mapStateToProps, null)(StockOwnershipInfo);