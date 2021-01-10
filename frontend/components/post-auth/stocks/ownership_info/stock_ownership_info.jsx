import React from "react";
import {connect} from "react-redux";
import {
    formatToDollar,
} from "../../../../util/dashboard_calcs";
import {
    getPosMarketValue,
    getSharesOwned,
    getPosCost,
    getPrevDayClose,
    getPortfolioValue,
} from "../../../../util/extract_from_state_utils";
import {
    getStrChange,
} from "../../../../util/chart_utils";
import StockOwnershipBox from "./stock_ownership_box";

const mapStateToProps = (state, {ticker}) => {
    const marketValue = getPosMarketValue(ticker, state);
    const sharesOwned = getSharesOwned(ticker, state);
    const positionCost = getPosCost(ticker, state);
    const prevDayMarketValue = getPrevDayClose(ticker, state);
    const portfolioValue = getPortfolioValue(state);
    
    const averageCost = formatToDollar(positionCost / sharesOwned);
    const positionCostStr = formatToDollar(positionCost);
    const oneDayReturn = getStrChange(prevDayMarketValue, marketValue);
    const totalReturn = getStrChange(positionCost, marketValue);
    const portfolioDiversity = (marketValue / portfolioValue * 100).toFixed(2) + "%";
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
                    {title: "Shares", val: sharesOwned},
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