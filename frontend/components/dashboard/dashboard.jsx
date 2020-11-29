import React from "react";
import Header from "./header";
import {fetchCandles,
    initializeAssets,
    RECEIVE_WEEKLY_CANDLES,
    RECEIVE_ANNUAL_CANDLES,
    fetchCompanyOverview,
} from "../../actions/external_api_actions";
import {updateSummaryValueHistory, updateCashHistory} from "../../actions/summary_actions"
import {connect} from "react-redux";
import { Route } from "react-router-dom";
import Summary from "./summary";
import Stock from "./stock";
import Loading from "./loading";
import {setAsLoading, finishedLoading} from "../../actions/loading_actions";
import {withRouter} from "react-router-dom";

const mapStateToProps = state => ({
    displayedAssets: state.entities.displayedAssets,
    state: state,
});

const mapDispatchToProps = dispatch => ({
        initializeAssets: trades => dispatch(initializeAssets(trades)),
        fetchCandles: (ticker, subtype) => (fetchCandles(ticker, dispatch, subtype)),
        fetchCompanyOverview: ticker => fetchCompanyOverview(ticker, dispatch),
        updateSummaryValueHistory: state => dispatch(updateSummaryValueHistory(state)),
        updateCashHistory: state => dispatch(updateCashHistory(state)),
        setAsLoading: () => dispatch(setAsLoading()),
        finishedLoading: () => dispatch(finishedLoading()),
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
            if (typeof(asset.ownershipHistory.numShares[asset.ownershipHistory.numShares.length - 1]) === "number") {
                if (asset.valueHistory === undefined) {
                this.props.fetchCandles(asset.ticker, RECEIVE_WEEKLY_CANDLES);
                this.props.fetchCandles(asset.ticker, RECEIVE_ANNUAL_CANDLES);
                }
            }
        })
    }

    isStockIndexPage() {
        return (this.props.location.pathname.slice(0,18) === "/dashboard/stocks/")
    }

    isDashboardPage() {
        return this.props.location.pathname === "/dashboard";
    }

    isStockLoaded(ticker) {
        if (this.props.displayedAssets[ticker] === undefined ||
        this.props.displayedAssets[ticker].prices === undefined ||
        this.props.displayedAssets[ticker].prices.oneDay === undefined ||
        this.props.displayedAssets[ticker].prices.oneWeek === undefined ||
        this.props.displayedAssets[ticker].prices.oneYear === undefined ||
        this.props.displayedAssets[ticker].companyOverview === undefined
        ){ return false }
        return true;
    }

    checkForNeedToInitializeAStock() {
        if (this.isStockIndexPage()) {
            let ticker = this.getTickerFromPath();
            if ( !this.isStockLoaded(ticker)) {
                this.props.fetchCandles(ticker);
                this.props.fetchCandles(ticker, RECEIVE_WEEKLY_CANDLES);
                this.props.fetchCandles(ticker, RECEIVE_ANNUAL_CANDLES);
                this.props.fetchCompanyOverview(ticker);
                this.props.setAsLoading();
            }
        }
        return true;
    }

    pageIsLoading() {
        return this.props.state.ui.loading
    }

    componentDidMount() {
        this.props.initializeAssets(this.props.state);
        this.timesComponentUpdated++;
    }

    assetWasOwned(asset) {
        if (typeof(asset.ownershipHistory.numShares.last()) === "number") {
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
            if (this.assetWasOwned(asset)) {
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

    componentDidUpdate() {
        if (this.timesComponentUpdated === 1) {

            this.fetchInitialCandles();
            
            this.checkForNeedToInitializeAStock();
            
        } else {
            if (this.props.state.ui.updatesNeeded.cashHistory) {
                this.props.updateCashHistory(this.props.state);
            } else if (this.props.state.ui.updatesNeeded.valueHistory) {
                this.props.updateSummaryValueHistory(this.props.state);
            } else if (this.pageIsLoading()) {
                let stillLoading = false;
                if (this.isDashboardPage()) {
                    stillLoading = this.assetsAreStillLoading();
                } else if (this.isStockIndexPage()) {
                    let ticker = this.getTickerFromPath();
                    if (!this.isStockLoaded(ticker)) {
                        stillLoading = true;
                    }
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
                    <Loading increase={this.props.state.ui.valueIncreased}/>
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
                            <Route path="/dashboard/stocks/:ticker" render={props => <Stock ticker={this.getTickerFromPath()}/>} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))