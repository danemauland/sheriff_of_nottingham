import React from "react";
import StockSummaryChartContainer from "./stock_chart_container";
import StockOwnershipInfo from "./ownership_info/stock_ownership_info";
import StockAbout from "./about/stock_about";
import {connect} from "react-redux";
import {tickerIsOwned} from "../../../util/dashboard_calcs";
import CompanyNews from "./company_news";
import {
    getSharesOwned,
    getCompanyName,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    isOwned: tickerIsOwned(ticker, getSharesOwned(state, ticker)),
    companyName: getCompanyName(state, ticker),
});

const StockContent = ({companyName, ticker, isOwned}) => (
    <div className="post-auth-main-content">
        <h1 className="post-auth-title">{companyName}</h1>

        <StockSummaryChartContainer ticker={ticker}/>

        {isOwned ? <StockOwnershipInfo ticker={ticker} /> : <></>}

        <StockAbout ticker={ticker}/>

        <CompanyNews ticker={ticker}/>
    </div>
)

export default connect(mapStateToProps, null)(StockContent);