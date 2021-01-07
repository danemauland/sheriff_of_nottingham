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

        this.props.updateChart(ONE_DAY);
        ticker = this.getTickerFromPath();
        if (!isStockLoaded(ticker, assetInformation)) {
            this.props.initializeAsset(ticker);
            this.props.fetchAllInfo(ticker);
        }
        
    }
    
    isStockIndexPage() {
        return (this.props.location.pathname.slice(0,18) === "/dashboard/stocks/")
    }

    pageIsLoading() {
        return this.props.loading;
    }

    assetWasOwned(ticker) {
        if (typeof(this.props.ownershipHistories.numShares[ticker].last()) === "number") {
            return true;
        }
        return false;
    }

    assetIsStillUpdating(ticker) {
        const valuations = this.props.valuations;
        return !(valuations.oneDay[ticker] && valuations.oneWeek[ticker] && valuations.oneYear[ticker])
    }

    getTickerFromPath() {
        return this.props.location.pathname.slice(18,this.props.location.pathname.length);
    }

    componentDidUpdate(prevProps) {
        let ticker;
        if (prevProps.location !== this.props.location) {
            this.props.updateChart(ONE_DAY);
            ticker = this.getTickerFromPath();
            if (!isStockLoaded(ticker, assetInformation)) {
                this.props.initializeAsset(ticker);
                this.props.fetchAllInfo(ticker);
            }
        } else if (this.pageIsLoading()) {
            let stillLoading = false;
            ticker = this.getTickerFromPath();
            stillLoading ||= !isStockLoaded(ticker, this.props.assetInformation);
            if (!stillLoading) {
                this.props.finishedLoading();
            }
        } 
    }

    render() {
        if (this.pageIsLoading()) return <Loading />;
        
        return <Stock />
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StockInitializer));