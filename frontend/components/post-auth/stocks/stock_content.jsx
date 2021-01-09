import React from "react";
import StockSummaryChartContainer from "./stock_chart_container";
import StockOwnershipInfo from "./stock_ownership_info";
import StockAbout from "./stock_about";
import {connect} from "react-redux";
import {tickerIsOwned} from "../../../util/dashboard_calcs";
import CompanyNews from "./company_news";

const mapStateToProps = ({newEntities: {assetInformation}}, {ticker}) => {
    const numShares = assetInformation.ownershipHistories.numShares;
    debugger;
    return ({
        ticker,
        owned: tickerIsOwned(ticker, numShares[ticker]),
        companyName: assetInformation.companyOverviews[ticker].Name,
    })
}

const StockContent = ({companyName, ticker, owned}) => (
    <div className="post-auth-main-content">
        <h1 className="post-auth-title">{companyName}</h1>

        <StockSummaryChartContainer ticker={ticker}/>

        {owned ? <StockOwnershipInfo ticker={ticker} /> : <></>}

        <StockAbout ticker={ticker}/>
        
        <CompanyNews ticker={ticker}/>
    </div>
)

export default connect(mapStateToProps, null)(StockContent);