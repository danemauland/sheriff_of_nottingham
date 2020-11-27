import React from "react";
import DynamicChart from "./dynamic_chart";
import Cash from "./cash";

class DashboardContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-main-content">
                <DynamicChart />
                <Cash />
            </div>
        )
    }
}

export default DashboardContent;