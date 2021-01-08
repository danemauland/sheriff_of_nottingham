import React from "react";
import {
    fetchAllInfo,
    initializeAsset,
} from "../../../actions/external_api_actions";
import {connect} from "react-redux";
import Loading from "../loading";
import {withRouter} from "react-router-dom";
import { isStockLoaded} from "../../../util/dashboard_calcs";
import Stock from "./stock";

const mapStateToProps = ({newEntities: {assetInformation}}) => ({
    assetInformation,
});

const mapDispatchToProps = dispatch => ({
        fetchAllInfo: tickers => fetchAllInfo(tickers, dispatch),
        initializeAsset: ticker => dispatch(initializeAsset(ticker)),
});



class StockInitializer extends React.Component {

    componentDidMount() {
        const {
            assetInformation,
            initializeAsset,
            fetchAllInfo
        } = this.props;
        const ticker = this.ticker;
        if (!isStockLoaded(ticker, assetInformation)) {
            initializeAsset(ticker);
            fetchAllInfo(ticker);
        }
    }

    get ticker() {
        return this.props.match.params.ticker;
    }

    render() {
        const assetInformation = this.props.assetInformation;

        if (!isStockLoaded(this.ticker, assetInformation)) return <Loading />;
        
        return <Stock />
    }
}

const mapped = connect(mapStateToProps, mapDispatchToProps)(StockInitializer);
export default withRouter(mapped);