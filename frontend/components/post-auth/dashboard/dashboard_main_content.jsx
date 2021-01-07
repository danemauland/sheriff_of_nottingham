import React from "react";
import AccountChartContainer from "./account_chart_container";
import Cash from "./cash";
import MarketNews from "./market_news";

const DashboardMainContent = () => (
    <div className="dashboard-main-content">
        <AccountChartContainer />
        <Cash />
        <MarketNews />
    </div>
)

export default DashboardMainContent;