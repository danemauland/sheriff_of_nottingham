import React from "react";
import StockSummaryChartContainer from "./stock_chart_container";
import StockOwnershipInfo from "./stock_ownership_info";
import StockAbout from "./stock_about";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {tickerIsOwned} from "../../../util/dashboard_calcs";
import CompanyNews from "./company_news";

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    owned: tickerIsOwned(ticker, state.newEntities.assetInformation.ownershipHistories.numShares[ticker]),
    // companyName: state.entities.displayedAssets[ticker].companyOverview.Name,
    companyName: state.newEntities.assetInformation.companyOverviews[ticker].Name,
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
                {this.props.owned ? <StockOwnershipInfo ticker={this.props.ticker} /> : <></>}
                <StockAbout ticker={this.props.ticker}/>
                <CompanyNews ticker={this.props.ticker}/>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, null)(StockContent));