import React from "react";
import {formatToDollar} from "../../util/dashboard_calcs";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({
        username: state.session.username,
        cashBal: state.entities.summary.cashHistory.balances[state.entities.summary.cashHistory.balances.length - 1],
        portfolioVal: state.entities.summary.valueHistory.values.oneDay[state.entities.summary.valueHistory.values.oneDay.length - 1],
        trades: state.entities.trades,
        displayedAssets: state.entities.displayedAssets,
    })
}

class AccountSummaryHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <header className="account-summary-header">
                <h1>{formatToDollar(this.props.portfolioVal)}</h1>
            </header>
        )
    }
}

export default connect(mapStateToProps, null)(AccountSummaryHeader);