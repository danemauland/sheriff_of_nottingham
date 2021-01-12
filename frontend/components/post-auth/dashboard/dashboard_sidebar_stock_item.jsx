import {Link} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
import {
    formatPercentage,
} from "../../../util/dashboard_calcs";
import {
    getSharesOwned,
    getLastPrice,
    getDayPercentChange,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = (state, {ticker}) => {
    const lastPrice = getLastPrice(state, ticker);
    return {
        lastPrice,
        strChange: formatPercentage(getDayPercentChange(state, ticker)),
        numShares: getSharesOwned(state, ticker),
    }
}

const DashboardSidebarStockItem = ({ticker, numShares, strChange}) => (
    <Link to={"/stocks/" + ticker} className="position-item">
        <div>
            <h4>{ticker}</h4>
            <span>{`${numShares} Share${numShares !== 1 ? "s" : ""}`}</span>

        </div>

        <div className="CHART_PLACEHOLDER"></div>
        
        <div>
            <span className={strChange[0] === "+" ? "green" : "red"}>
                {strChange}
            </span>
        </div>
    </Link>  
)

export default connect(mapStateToProps, null)(DashboardSidebarStockItem);