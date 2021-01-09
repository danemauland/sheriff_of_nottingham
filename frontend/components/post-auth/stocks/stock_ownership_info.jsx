import React from "react";
import {connect} from "react-redux";
import {
    positionValue,
    positionCost,
    formatToDollar,
    ONE_DAY,
    portfolioValue,
} from "../../../util/dashboard_calcs";
import {
    getPreviousEndingValue,
    getStrChange,
} from "../../../util/chart_utils";

const mapStateToProps = (state, {ticker}) => {
    const marketValue = positionValue(ticker, state);
    const numShares = state.newEntities.assetInformation.ownershipHistories.numShares[ticker].last();
    const totalPositionCost = positionCost(ticker, state);
    const prevDayCloseValue = getPreviousEndingValue(
        state.newEntities.assetInformation.valuations.oneYear[ticker],
        ONE_DAY
    );
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
            <div className="stock-ownership-positioner">
                <div>
                    <div className="stock-ownership-market-val-info-wrapper">
                        <div>Your Market Value</div>
                        <h3>{this.props.marketValue}</h3>
                        <div className="stock-ownership-sub-container">
                            <div>
                                <span>Cost</span>
                                <span>{this.props.positionCost}</span>
                            </div>
                            <div>
                                <span>Today's Return</span>
                                <span>{this.props.oneDayReturn}</span>
                            </div>
                            <div>
                                <span>Total Return</span>
                                <span>{this.props.totalReturn}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>Your Average Cost</div>
                    <h3>{this.props.averageCost}</h3>
                    <div className="stock-ownership-sub-container">
                        <div>
                            <span>Shares</span>
                            <span>{this.props.numShares}</span>
                        </div>
                        <div>
                            <span>Portfolio Diversity</span>
                            <span>{this.props.portfolioDiversity}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(OwnershipInfo)