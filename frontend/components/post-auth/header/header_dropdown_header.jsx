import React from "react";
import {formatToDollar} from "../../../util/dashboard_calcs";
import {connect} from "react-redux";
import {
    getUsername,
    getCashBalance,
    getPortfolioValue,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = state => ({
        username: getUsername(state),
        cashBal: formatToDollar(getCashBalance(state)),
        portfolioVal: formatToDollar(getPortfolioValue(state)),
});

const HeaderDropdownHeader = ({username, portfolioVal, cashBal}) => (
    <header className="account-dropdown-header">
        <h3>{username}</h3>

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

export default connect(mapStateToProps, null)(HeaderDropdownHeader);