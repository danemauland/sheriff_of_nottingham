import React from "react";
import AccountSummary from "./account_summary";
import Cash from "./cash";

class DashboardContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <AccountSummary />
                <Cash />
            </div>
        )
    }
}

export default DashboardContent;