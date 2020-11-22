import React from "react";
import {calcCashBal, calcPortfolioVal, formatToDollar} from "../../util/dashboard_calcs";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({
        username: state.session.username,
        cashTransactions: state.entities.cashTransactions,
        trades: state.entities.trades,
        displayedAssets: state.entities.displayedAssets,
    })
}

class AccountSummaryHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let cashBal = calcCashBal(this.props.cashTransactions, this.props.trades);
        let portfolioVal = calcPortfolioVal(this.props.displayedAssets, cashBal);
        portfolioVal = formatToDollar(portfolioVal);
        return (
            <header className="account-summary-header">
                <h1>{portfolioVal}</h1>
            </header>
        )
    }
}

export default connect(mapStateToProps, null)(AccountSummaryHeader);