import React from "react";
import Header from "./header";
import {fetchCandles,
    initializeAssets,
RECEIVE_WEEKLY_CANDLES,
RECEIVE_ANNUAL_CANDLES,
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
    componentDidMount() {
        this.props.initializeAssets(this.props.state);
        this.timesComponentUpdated++;
    }

    componentDidUpdate() {
        let ticker;
        if (this.timesComponentUpdated === 1) {
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
            if (this.props.location.pathname.slice(0,18) === "/dashboard/stocks/") {
                ticker = this.props.location.pathname.slice(18,this.props.location.pathname.length);
                let needToLoad;
                if (
                    this.props.displayedAssets[ticker] === undefined ||
                    this.props.displayedAssets[ticker].prices === undefined ||
                    this.props.displayedAssets[ticker].prices.oneDay === undefined ||
                    this.props.displayedAssets[ticker].prices.oneWeek === undefined ||
                    this.props.displayedAssets[ticker].prices.oneYear === undefined
                ) {
                    this.props.fetchCandles(ticker);
                    this.props.fetchCandles(ticker, RECEIVE_WEEKLY_CANDLES);
                    this.props.fetchCandles(ticker, RECEIVE_ANNUAL_CANDLES);
                    this.props.setAsLoading();
                }
            }
        } else {
            if (this.props.state.ui.updatesNeeded.cashHistory) {
                this.props.updateCashHistory(this.props.state);
            } else if (this.props.state.ui.updatesNeeded.valueHistory) {
                this.props.updateSummaryValueHistory(this.props.state);
            } else if (this.props.state.ui.loading) {
                let stillLoading = false;
                if (this.props.location.pathname === "/dashboard") {
                    Object.values(this.props.displayedAssets).forEach(asset => {
                        if (typeof(asset.ownershipHistory.numShares.last()) === "number") {
                            if (asset.valueHistory === undefined ||
                                asset.valueHistory.oneDay === undefined ||
                                asset.valueHistory.oneWeek === undefined ||
                                asset.valueHistory.oneYear === undefined
                            ) {
                                stillLoading = true;
                            }
                        }
                    })
                } else if (this.props.location.pathname.slice(0,18) === "/dashboard/stocks/") {
                    ticker = this.props.location.pathname.slice(18,this.props.location.pathname.length);
                    if (
                        this.props.displayedAssets[ticker] === undefined ||
                        this.props.displayedAssets[ticker].prices === undefined ||
                        this.props.displayedAssets[ticker].prices.oneDay === undefined ||
                        this.props.displayedAssets[ticker].prices.oneWeek === undefined ||
                        this.props.displayedAssets[ticker].prices.oneYear === undefined
                    ) {
                        stillLoading = true;
                    }
                }
                if (!stillLoading) {
                    this.props.finishedLoading();
                }
            } else {
                if (this.props.location.pathname.slice(0,18) === "/dashboard/stocks/") {
                    ticker = this.props.location.pathname.slice(18,this.props.location.pathname.length);
                    let needToLoad;
                    if (
                        this.props.displayedAssets[ticker] === undefined ||
                        this.props.displayedAssets[ticker].prices === undefined ||
                        this.props.displayedAssets[ticker].prices.oneDay === undefined ||
                        this.props.displayedAssets[ticker].prices.oneWeek === undefined ||
                        this.props.displayedAssets[ticker].prices.oneYear === undefined
                    ) {
                        this.props.fetchCandles(ticker);
                        this.props.fetchCandles(ticker, RECEIVE_WEEKLY_CANDLES);
                        this.props.fetchCandles(ticker, RECEIVE_ANNUAL_CANDLES);
                        this.props.setAsLoading();
                    }
                }
            }
        }
        this.timesComponentUpdated++
    }

    render() {
        if (this.props.state.ui.loading) {
            return <Loading increase={this.props.state.ui.valueIncreased}/>
        }
        return (
            <>
                <Header />
                <div className="scroll-bar-correction">
                    <div className="dashboard-centering-div">
                        <div className="dashboard-main-div">
                            <Route exact path="/dashboard" component={Summary}/>
                            <Route path="/dashboard/stocks/:ticker" component={Stock} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))