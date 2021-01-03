import React from "react";
import {connect} from "react-redux";
import StockItem from "./stock_item";

const getOwnedStocks = (state) => {
    const arr = [];
    Object.values(state.entities.displayedAssets).forEach(asset => {
        if (asset.ownershipHistory && asset.ownershipHistory.numShares &&
            asset.ownershipHistory.numShares.length > 0 &&
            asset.ownershipHistory.numShares.last() !== 0
        ) {
            arr.push(asset);
        }
    })
    return arr;
}

const mapStateToProps = state => {
    let stocks = getOwnedStocks(state);
    return ({
        stocks,
    })
}

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
                            {this.props.stocks.map((stock, i) => <StockItem key={i} stock={stock}/>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Sidebar);