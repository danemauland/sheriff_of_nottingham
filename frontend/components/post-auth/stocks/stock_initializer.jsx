import React from "react";
import {
    fetchMarketNews,
    fetchAllInfo,
    initializeAsset,
} from "../../../actions/external_api_actions";
import {connect} from "react-redux";
import Loading from "../loading";
import {setAsLoading, finishedLoading} from "../../../actions/loading_actions";
import {withRouter} from "react-router-dom";
import { isStockLoaded, ONE_DAY} from "../../../util/dashboard_calcs";
import { updateChart } from "../../../actions/chart_selected_actions";
import Stock from "./stock";

const mapStateToProps = ({newEntities, ui}) => {
    const assetInformation = newEntities.assetInformation;
    const portfolioHistory = newEntities.portfolioHistory;
    return ({
        assetInformation,
        tickers: assetInformation.tickers,
        trades: portfolioHistory.trades,
        cashTransactions: portfolioHistory.cashTransactions,
        ownershipHistories: assetInformation.ownershipHistories,
        valuations: assetInformation.valuations,
        marketNews: newEntities.marketNews,
        loading: ui.loading,
    })
};

const mapDispatchToProps = dispatch => ({
        fetchAllInfo: tickers => fetchAllInfo(tickers, dispatch),
        setAsLoading: () => dispatch(setAsLoading()),
        finishedLoading: () => dispatch(finishedLoading()),
        updateChart: chartType => dispatch(updateChart(chartType)),
        fetchMarketNews: () => fetchMarketNews(dispatch),
        initializeAsset: ticker => dispatch(initializeAsset(ticker)),
});



class StockInitializer extends React.Component {

    componentDidMount() {
        const assetInformation = this.props.assetInformation;

        const ticker = this.ticker;
        if (!isStockLoaded(ticker, assetInformation)) {
            this.props.initializeAsset(ticker);
            this.props.fetchAllInfo(ticker);
        }
        
    }

    get ticker() {
        return this.props.match.params.ticker;
    }

    pageIsLoading() {
        return this.props.loading;
    }

    assetIsStillUpdating(ticker) {
        const valuations = this.props.valuations;
        return !(valuations.oneDay[ticker] && valuations.oneWeek[ticker] && valuations.oneYear[ticker])
    }

    render() {
        if (this.pageIsLoading()) return <Loading />;
        
        return <Stock />
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StockInitializer));