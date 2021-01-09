import StockContent from "./stock_content";
import StockSidebar from "./stock_sidebar";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isStockLoaded } from "../../../util/dashboard_calcs";


const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.match.params.ticker;
    const assetInformation = state.newEntities.assetInformation;
    return {
        loading: !isStockLoaded(ticker, assetInformation),
        ticker,
        assetInformation,
    }
}

class Stock extends React.Component {

    render() {
        return (
            <>
                
            </>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Stock));