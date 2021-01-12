import React from "react";
import {connect} from "react-redux";
import DashboardSidebarStockItem from "./dashboard_sidebar_stock_item";
import {
    getOwnedTickers,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = state => ({
    ownedTickers: getOwnedTickers(state),
})

const DashboardSidebar = ({ownedTickers}) => (
    <div className="sidebar-placeholder">
        <div className="stocks-header">
            <span>Stocks</span>
        </div>

        <div className="stocks-list">
            {ownedTickers.map((ticker, i) => (
                <DashboardSidebarStockItem key={i} ticker={ticker}/>
            ))}
        </div>
    </div>
)

export default connect(mapStateToProps, null)(DashboardSidebar);