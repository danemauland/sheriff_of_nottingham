import React from "react";
import AccountChartContainer from "./account_chart_container";
import Cash from "./cash";
import MarketNewsContainer from "./market_news_container";

const DashboardMainContent = () => (
    <div className="dashboard-main-content">
        <AccountChartContainer />
        <Cash />
        <MarketNewsContainer />
    </div>
)

export default DashboardMainContent;