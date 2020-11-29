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
                <div className="stock-ownership-market-val-info-container">
                    <div className="stock-ownership-market-val-info-wrapper">
                        <div>Your Market Value</div>
                        <h3>{this.props.marketValue}</h3>
                        <div className="stock-ownership-market-val-breakdown">
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
                <div className="stock-ownership-portfolio-impact-container">
                    <div>Your Average Cost</div>
                    <h3>{this.props.averageCost}</h3>
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
        )
    }
}

export default connect(mapStateToProps, null)(OwnershipInfo)