import React from "react";
import {connect} from "react-redux";
import StockItem from "./dashboard/stock_item";

const getOwnedTickers = state => {
    const arr = [];
    const assetInformation = state.newEntities.assetInformation;
    const numShares = assetInformation.ownershipHistories.numShares;
    Object.values(assetInformation.tickers).forEach(ticker => {
        if (numShares[ticker] && numShares[ticker].last() !== 0) arr.push(asset);
    })
    return arr;
}

const mapStateToProps = state => {
    let tickers = getOwnedTickers(state);
    return ({
        tickers,
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
                            {this.props.tickers.map((ticker, i) => <StockItem key={i} ticker={ticker}/>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Sidebar);