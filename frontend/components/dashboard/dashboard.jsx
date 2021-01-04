import React from "react";
import Header from "./header";
import {fetchCandles,
    initializeAssets,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
    fetchCompanyOverview,
    fetchTickerData,
    fetchCompanyNews,
    fetchMarketNews,
    initializeAsset,
} from "../../actions/external_api_actions";
import {updateSummaryValueHistory, updateCashHistory} from "../../actions/summary_actions"
import {connect} from "react-redux";
import { Route } from "react-router-dom";
import Summary from "./summary";
import Stock from "./stock";
import Loading from "./loading";
import {setAsLoading, finishedLoading} from "../../actions/loading_actions";
import {withRouter} from "react-router-dom";
import { isStockLoaded, ONE_DAY} from "../../util/dashboard_calcs";
import { updateChart } from "../../actions/chart_selected_actions";

const mapStateToProps = state => ({
    displayedAssets: state.entities.displayedAssets,
    trades: state.newEntities.portfolioHistory.trades,
    cashTransactions: state.newEntities.portfolioHistory.cashTransactions,
    ownershipHistories: state.newEntities.assetInformation.ownershipHistories,
    state: state,
});

const mapDispatchToProps = dispatch => ({
        initializeAssets: (trades, cashTransactions) => dispatch(initializeAssets(trades, cashTransactions)),
        fetchCandles: (ticker, subtype) => (fetchCandles(ticker, dispatch, subtype)),
        fetchCompanyOverview: ticker => fetchCompanyOverview(ticker, dispatch),
        updateSummaryValueHistory: state => dispatch(updateSummaryValueHistory(state)),
        updateCashHistory: state => dispatch(updateCashHistory(state)),
        setAsLoading: () => dispatch(setAsLoading()),
        finishedLoading: () => dispatch(finishedLoading()),
        updateChart: chartType => dispatch(updateChart(chartType)),
        fetchTickerData: ticker => fetchTickerData(ticker, dispatch),
        fetchCompanyNews: ticker => fetchCompanyNews(ticker, dispatch),
        fetchMarketNews: () => fetchMarketNews(dispatch),
        initializeAsset: ticker => dispatch(initializeAsset(ticker))
});



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.timesComponentUpdated = 0;
    }

    fetchInitialCandles() {
        Object.values(this.props.displayedAssets).forEach(asset => {
            if (asset.prices === undefined) {
                this.props.fetchCandles(asset.ticker)
            }
        })
        Object.values(this.props.displayedAssets).forEach(asset => {
            if (typeof(this.props.ownershipHistories.numShares[asset.ticker].last()) === "number") {
                if (asset.valueHistory === undefined) {
                    this.props.fetchCandles(asset.ticker, RECEIVE_WEEKLY_CANDLES);
                    this.props.fetchCandles(asset.ticker, RECEIVE_ANNUAL_CANDLES);
                }
            }
        })
    }

    fetchInitialCompanyOverviews() {
        Object.values(this.props.displayedAssets).forEach(asset => {
            if (asset.companyOverview === undefined) {
                this.props.fetchCompanyOverview(asset.ticker)
                this.props.fetchTickerData(asset.ticker)
                this.props.fetchCompanyNews(asset.ticker)
            }
        })
    }

    isStockIndexPage() {
        return (this.props.location.pathname.slice(0,18) === "/dashboard/stocks/")
    }

    isDashboardPage() {
        return this.props.location.pathname === "/dashboard";
    }

    checkForNeedToInitializeAStock(asset) {
        let ticker;
        const {trades, cashTransactions} = this.props;
        if (asset) {
            ticker = asset.ticker;
            if ( !isStockLoaded(ticker, this.props.state)) {
                this.props.initializeAsset(ticker);
                this.props.initializeAssets(trades, cashTransactions);
                this.props.fetchCandles(ticker);
                this.props.fetchCandles(ticker, RECEIVE_WEEKLY_CANDLES);
                this.props.fetchCandles(ticker, RECEIVE_ANNUAL_CANDLES);
                this.props.fetchCompanyOverview(ticker);
                this.props.fetchTickerData(ticker);
                this.props.fetchCompanyNews(ticker);
                this.props.setAsLoading();
            }
        } else if (this.isStockIndexPage()) {
            ticker = this.getTickerFromPath();
            if ( !isStockLoaded(ticker, this.props.state)) {
                this.props.initializeAsset(ticker);
                this.props.initializeAssets(trades, cashTransactions);
                this.props.fetchCandles(ticker);
                this.props.fetchCandles(ticker, RECEIVE_WEEKLY_CANDLES);
                this.props.fetchCandles(ticker, RECEIVE_ANNUAL_CANDLES);
                this.props.fetchCompanyOverview(ticker);
                this.props.fetchTickerData(ticker);
                this.props.fetchCompanyNews(ticker)
                this.props.setAsLoading();
            }
        }
        return true;
    }

    pageIsLoading() {
        return this.props.state.ui.loading
    }

    componentDidMount() {
        this.props.initializeAssets(this.props.trades, this.props.cashTransactions);
        this.timesComponentUpdated++;
        this.props.fetchMarketNews();
    }

    assetWasOwned(ticker) {
        if (typeof(this.props.ownershipHistories.numShares[ticker].last()) === "number") {
            return true;
        }
        return false
    }

    assetIsStillUpdating(asset) {
        if (asset.valueHistory === undefined ||
            asset.valueHistory.oneDay === undefined ||
            asset.valueHistory.oneWeek === undefined ||
            asset.valueHistory.oneYear === undefined
        ) { return true; }
        return false;
    }

    assetsAreStillLoading() {
        let stillLoading = false;
        Object.values(this.props.displayedAssets).forEach(asset => {
            if (this.assetWasOwned(asset.ticker)) {
                if (this.assetIsStillUpdating(asset)) {
                    stillLoading = true;
                }
            }
        })
        return stillLoading
    }

    getTickerFromPath() {
        return this.props.location.pathname.slice(18,this.props.location.pathname.length);
    }

    receivedMarketNews() {
        return this.props.state.entities.marketNews.length > 0;
    }

    componentDidUpdate(prevProps) {
        if (this.timesComponentUpdated === 1) {

            this.fetchInitialCandles();
            this.fetchInitialCompanyOverviews();
            
            this.checkForNeedToInitializeAStock();
            
        } else {
            if (prevProps.location !== this.props.location) {
                this.props.updateChart(ONE_DAY);
                Object.values(this.props.displayedAssets).forEach(asset =>
                    this.checkForNeedToInitializeAStock(asset)
                );
            } else if (this.props.state.ui.updatesNeeded.cashHistory) {
                this.props.updateCashHistory(this.props.state);
            } else if (this.props.state.ui.updatesNeeded.valueHistory) {
                this.props.updateSummaryValueHistory(this.props.state);
            } else if (this.pageIsLoading()) {
                let stillLoading = false;
                if (this.isDashboardPage()) {
                    stillLoading = this.assetsAreStillLoading();
                    stillLoading ||= !this.receivedMarketNews();
                } else if (this.isStockIndexPage()) {
                    let ticker = this.getTickerFromPath();
                    stillLoading ||= !isStockLoaded(ticker, this.props.state);
                }
                if (!stillLoading) {
                    this.props.finishedLoading();
                }
            } else {
                if (this.isStockIndexPage()) {
                    this.checkForNeedToInitializeAStock()
                }
            }
        }
        this.timesComponentUpdated++
    }

    render() {
        if (this.pageIsLoading()) {
            return (
                <>
                    <Loading />
                    <Header />
                </>
            )
        }
        return (
            <>
                <Header />
                <div className="scroll-bar-correction">
                    <div className="dashboard-centering-div">
                        <div className="dashboard-main-div">
                            <Route exact path="/dashboard" component={Summary}/>
                            <Route path="/dashboard/stocks/:ticker" render={() => <Stock />} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))