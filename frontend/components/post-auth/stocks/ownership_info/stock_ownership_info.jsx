import React from "react";
import {connect} from "react-redux";
import {
    formatToDollar,
} from "../../../../util/dashboard_calcs";
import {
    getPosMarketValue,
    getSharesOwned,
    getPosCost,
    getPrevDayValuation,
    getPortfolioValue,
} from "../../../../util/extract_from_state_utils";
import {
    getStrChange,
} from "../../../../util/chart_utils";
import StockOwnershipBox from "./stock_ownership_box";

const mapStateToProps = (state, {ticker}) => {
    const marketValue = getPosMarketValue(state, ticker);
    const sharesOwned = getSharesOwned(state, ticker);
    const positionCost = getPosCost(state, ticker);
    const prevDayMarketValue = getPrevDayValuation(state, ticker);
    const portfolioValue = getPortfolioValue(state);
    
    const averageCost = formatToDollar(positionCost / sharesOwned);
    const positionCostStr = formatToDollar(positionCost);
    const oneDayReturn = getStrChange(prevDayMarketValue, marketValue);
    const totalReturn = getStrChange(positionCost, marketValue);
    const marketValStr = formatToDollar(marketValue);

    let portfolioDiversity = marketValue / portfolioValue;
    portfolioDiversity = (portfolioDiversity * 100).toFixed(2) + "%";

    return ({
        boxes: [
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

const StockOwnershipInfo = ({boxes}) => (
    <div className="stock-ownership-positioner">
        {boxes.map((box, i) => <StockOwnershipBox key={i} {...box} />)}
    </div>
)

export default connect(mapStateToProps, null)(StockOwnershipInfo);