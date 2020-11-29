import React from "react";
import StockSummaryChartContainer from "./stock_summary_chart_container";
import OwnershipInfo from "./ownership_info";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {tickerIsOwned} from "../../util/dashboard_calcs";

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    owned: tickerIsOwned(ticker, state),
    companyName: state.entities.displayedAssets[ticker].companyOverview.Name,
})



class StockContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <h1 className="dashboard-title">{this.props.companyName}</h1>
                <StockSummaryChartContainer ticker={this.props.ticker}/>
                {this.props.owned ? <OwnershipInfo ticker={this.props.ticker} /> : <></>}
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, null)(StockContent));