import React from "react";
import StockSummaryChartContainer from "./stock_summary_chart_container";
import StockInfo from "./stock_info";

class DashboardContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <StockSummaryChartContainer />
                <StockInfo />
            </div>
        )
    }
}

export default DashboardContent;