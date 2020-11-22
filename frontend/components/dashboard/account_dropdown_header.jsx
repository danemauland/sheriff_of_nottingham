import React from "react";
import {calcPortfolioVal, formatToDollar} from "../../util/dashboard_calcs";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({
        username: state.session.username,
        cashBal: state.entities.summary.cashHistory.balances[state.entities.summary.cashHistory.balances.length - 1],
        trades: state.entities.trades,
        displayedAssets: state.entities.displayedAssets,
    })
}

class AccountDropdownHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let portfolioVal = calcPortfolioVal(this.props.displayedAssets, this.props.cashBal);
        return (
            <header className="account-dropdown-header">
                <h3>{this.props.username}</h3>
                <div className="dropdown-header-account-summary">
                    <div className="port-val-div">
                        <h3>{formatToDollar(portfolioVal)}</h3>
                        <p>Portfolio Value</p>
                    </div>
                    <div className="buying-power-div">
                        <h3>{formatToDollar(this.props.cashBal)}</h3>
                        <p>Buying power</p>
                    </div>
                </div>
            </header>
        )
    }
}

export default connect(mapStateToProps, null)(AccountDropdownHeader);