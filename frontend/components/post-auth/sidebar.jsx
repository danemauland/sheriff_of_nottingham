import React from "react";
import {connect} from "react-redux";
import StockItem from "./dashboard/stock_item";
import {
    getOwnedTickers,
} from "../../util/extract_from_state_utils";

const mapStateToProps = state => ({
    ownedTickers: getOwnedTickers(state),
})

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-sidebar-spacer">
                <div className="dashboard-sidebar-wrapper">
                    <div className="sidebar-placeholder">
                        <div className="stocks-header">
                            <span>Stocks</span>
                        </div>
                        <div className="stocks-list">
                            {this.props.ownedTickers.map((ticker, i) => <StockItem key={i} ticker={ticker}/>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Sidebar);