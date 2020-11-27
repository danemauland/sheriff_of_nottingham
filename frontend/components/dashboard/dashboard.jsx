import React from "react";
import Header from "./header";
import {fetchCandles,
    initializeAssets,
RECEIVE_WEEKLY_CANDLES,
RECEIVE_ANNUAL_CANDLES,
} from "../../actions/external_api_actions";
import {updateSummaryValueHistory, updateCashHistory} from "../../actions/summary_actions"
import {connect} from "react-redux";
import DashboardContent from "./dashboard_content";
import Sidebar from "./sidebar";

const mapStateToProps = state => ({
    displayedAssets: state.entities.displayedAssets,
    state: state,
});

const mapDispatchToProps = dispatch => ({
        initializeAssets: trades => dispatch(initializeAssets(trades)),
        fetchCandles: (ticker, subtype) => (fetchCandles(ticker, dispatch, subtype)),
        updateSummaryValueHistory: state => dispatch(updateSummaryValueHistory(state)),
        updateCashHistory: state => dispatch(updateCashHistory(state)),
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
        } else {
            if (this.props.state.ui.updatesNeeded.cashHistory) {
                // debugger
                this.props.updateCashHistory(this.props.state);
            } else if (this.props.state.ui.updatesNeeded.valueHistory) {
                // debugger
                this.props.updateSummaryValueHistory(this.props.state);
            }
        }
        this.timesComponentUpdated++
    }

    render() {
        return (
            <>
                <Header />
                <div className="scroll-bar-correction">
                    <div className="dashboard-centering-div">
                        <div className="dashboard-main-div">
                            <DashboardContent />
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)