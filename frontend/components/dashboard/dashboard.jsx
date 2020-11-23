import React from "react";
import {Link} from "react-router-dom";
import Header from "./header";
import {fetchCandles,
    initializeAssets,
RECEIVE_WEEKLY_CANDLES,
RECEIVE_ANNUAL_CANDLES,
} from "../../actions/external_api_actions";
import {connect} from "react-redux";
import DashboardContent from "./dashboard_content";
import Sidebar from "./sidebar";

const mapStateToProps = state => ({
    displayedAssets: state.entities.displayedAssets,
    state: state,
})

const mapDispatchToProps = dispatch => {
    return ({
        initializeAssets: trades => dispatch(initializeAssets(trades)),
        fetchCandles: (ticker, subtype) => dispatch(fetchCandles(ticker, subtype)),
})}

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
                if (asset.ownershipHistory.numShares[asset.ownershipHistory.numShares.length - 1]) {
                    if (asset.valueHistory === undefined) {
                    this.props.fetchCandles(asset.ticker, RECEIVE_WEEKLY_CANDLES);
                    this.props.fetchCandles(asset.ticker, RECEIVE_ANNUAL_CANDLES);
                    }
                }
            })
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