import React from "react";
import AccountSummaryChartContainer from "./account_summay_chart_container";
import Cash from "./cash";

class DashboardContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <AccountSummaryChartContainer />
                <Cash />
            </div>
        )
    }
}

export default DashboardContent;