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

const mapDispatchToProps = dispatch => ({
        fetchAllInfo: tickers => fetchAllInfo(tickers, dispatch),
});


class Stock extends React.Component {
    constructor(props) {
        super(props)
    }

    // componentDidMount() {
    //     if (this.props.loading) {
    //         this.props.fetchAllInfo(this.props.ticker, this.props.assetInformation);
    //     }
    // }
    render() {
        if (this.props.loading) {
            return <></>
        }
        return (
            <>
                <StockContent ticker={this.props.ticker}/>
                <StockSidebar ticker={this.props.ticker}/>
            </>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Stock));