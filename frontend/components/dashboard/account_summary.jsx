import React from "react";
import {connect} from "react-redux";
import AccountSummaryHeader from "./account_summary_header";

const mapStateToProps = state => ({

})

class AccountSummary extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="account-summary-wrapper">
                <AccountSummaryHeader />
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(AccountSummary);