import React from "react";
import DashboardChartContainer from "./dashboard_chart_container";
import Cash from "./cash/cash";
import MarketNewsContainer from "./market_news_container";

const DashboardMainContent = () => (
    <div className="post-auth-main-content">
        <DashboardChartContainer />
        <Cash />
        <MarketNewsContainer />
    </div>
)

export default DashboardMainContent;