import React from "react";
import StockSummaryChartContainer from "./stock_chart_container";
import StockOwnershipInfo from "./stock_ownership_info";
import StockAbout from "./stock_about";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {tickerIsOwned} from "../../../util/dashboard_calcs";
import CompanyNews from "./company_news";

const mapStateToProps = ({newEntities: {assetInformation}}, {ticker}) => {
    const numShares = assetInformation.ownershipHistories.numShares;
    return ({
        ticker,
        owned: tickerIsOwned(ticker, numShares[ticker]),
        companyName: assetInformation.companyOverviews[ticker].Name,
    })
}



class StockContent extends React.Component {

    render() {
        return (
            <div className="post-auth-main-content">
                <h1 className="post-auth-title">{this.props.companyName}</h1>
                <StockSummaryChartContainer ticker={this.props.ticker}/>
                {this.props.owned ? <StockOwnershipInfo ticker={this.props.ticker} /> : <></>}
                <StockAbout ticker={this.props.ticker}/>
                <CompanyNews ticker={this.props.ticker}/>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, null)(StockContent));