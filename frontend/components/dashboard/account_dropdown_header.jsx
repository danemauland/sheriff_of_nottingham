import React from "react";
import {formatToDollar} from "../../util/dashboard_calcs";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const portfolioHistory = state.newEntities.portfolioHistory;
    return ({
        username: state.session.username,
        cashBal: portfolioHistory.cashHistory.balances.last(),
        portfolioVal: portfolioHistory.valuationHistory.valuations.oneDay.last(),
        trades: state.newEntities.trades,
        displayedAssets: state.entities.displayedAssets,
    })
}

class AccountDropdownHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <header className="account-dropdown-header">
                <h3>{this.props.username}</h3>
                <div className="dropdown-header-account-summary">
                    <div className="port-val-div">
                        <h3>{formatToDollar(this.props.portfolioVal)}</h3>
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