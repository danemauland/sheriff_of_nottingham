import React from "react";
import {fetchNeededInfo} from "../../../actions/external_api_actions";
import {connect} from "react-redux";
import Loading from "../loading";
import {isStockLoaded} from "../../../util/dashboard_calcs";
import StockContent from "./stock_content";
import StockSidebar from "./stock_sidebar";

const mapStateToProps = (state, {match: {params}, assetInformation}) => ({
    assetInformation,
    isLoading: (!isStockLoaded(params.ticker, assetInformation)),
})

const mapDispatchToProps = (dispatch, {assetInformation}) => ({
        fetchNeededInfo: tickers => (
            fetchNeededInfo(tickers, assetInformation, dispatch)
        ),
});

class StockInitializer extends React.Component {

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        this.props.fetchNeededInfo(this.ticker);
    }

    get ticker() {
        return this.props.match.params.ticker;
    }

    render() {
        if (this.props.isLoading) return <Loading />;
        
        return (
            <>
                <StockContent ticker={this.ticker}/>
                <StockSidebar ticker={this.ticker}/>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockInitializer);