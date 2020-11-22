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

class AccountDropdownHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let cashBal = calcCashBal(this.props.cashTransactions, this.props.trades);
        let portfolioVal = calcPortfolioVal(this.props.displayedAssets, cashBal);
        cashBal = formatToDollar(cashBal);
        portfolioVal = formatToDollar(portfolioVal);
        return (
            <header className="account-dropdown-header">
                <h3>{this.props.username}</h3>
                <div className="dropdown-header-account-summary">
                    <div className="port-val-div">
                        <h3>{portfolioVal}</h3>
                        <p>Portfolio Value</p>
                    </div>
                    <div className="buying-power-div">
                        <h3>{cashBal}</h3>
                        <p>Buying power</p>
                    </div>
                </div>
            </header>
        )
    }
}

export default connect(mapStateToProps, null)(AccountDropdownHeader);