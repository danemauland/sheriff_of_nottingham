import React from "react";
import AccountSummary from "./account_summary"
class DashboardContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <AccountSummary />
            </div>
        )
    }
}

export default DashboardContent;