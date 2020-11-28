import React from "react";
import StockSummaryChartContainer from "./stock_summary_chart_container";
import OwnershipInfo from "./ownership_info";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.match.params.ticker;
    let owned = false;
    if (state.entities.displayedAssets[ticker] &&
        state.entities.displayedAssets[ticker].ownershipHistory &&
        state.entities.displayedAssets[ticker].ownershipHistory.numShares && 
        state.entities.displayedAssets[ticker].ownershipHistory.numShares.length > 0 &&
        state.entities.displayedAssets[ticker].ownershipHistory.numShares.last() !== 0
        ) {owned = true}
    debugger
    return ({
    ticker,
    owned: owned,
    })
}



class StockContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <StockSummaryChartContainer />
                {this.props.owned ? <OwnershipInfo /> : <></>}
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, null)(StockContent));