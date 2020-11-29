import React from "react";
import {connect} from "react-redux";
import {
    positionValue,
    numSharesOwned,
    positionCost,
    formatToDollar,
    ONE_DAY,
    portfolioValue,
} from "../../util/dashboard_calcs";
import {
    getPreviousEndingValue,
    getStrChange,
} from "../../util/chart_utils";

const mapStateToProps = (state, {ticker}) => {
    const marketValue = positionValue(ticker, state);
    const numShares = numSharesOwned(ticker, state);
    const totalPositionCost = positionCost(ticker, state);
    const prevDayCloseValue = getPreviousEndingValue(
        state.entities.displayedAssets[ticker].valueHistory.oneYear,
        ONE_DAY
    );
    console.log(prevDayCloseValue)
    console.log(marketValue)
    return ({
        marketValue: formatToDollar(marketValue),
        numShares,
        positionCost: formatToDollar(totalPositionCost),
        oneDayReturn: getStrChange(prevDayCloseValue, marketValue),
        totalReturn: getStrChange(totalPositionCost, marketValue),
        averageCost: formatToDollar(totalPositionCost / numShares),
        portfolioDiversity: (marketValue / portfolioValue(state) * 100).toFixed(2) + "%",
})
}

class OwnershipInfo extends React.Component {
    constructor(props) {
        super(props)
    }
    

    render() {
        return (
            <div>
                <div>{this.props.marketValue}</div>
                <div>{this.props.numShares}</div>
                <div>{this.props.positionCost}</div>
                <div>{this.props.oneDayReturn}</div>
                <div>{this.props.totalReturn}</div>
                <div>{this.props.averageCost}</div>
                <div>{this.props.portfolioDiversity}</div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(OwnershipInfo)