import React from "react";
import {Link} from "react-router-dom";
import Header from "./header";
import {fetchQuote, initializeAssets} from "../../actions/external_api_actions";
import {connect} from "react-redux";
import DashboardContent from "./dashboard_content";
import Sidebar from "./sidebar";

const mapStateToProps = state => ({
    displayedAssets: state.entities.displayedAssets,
    trades: state.entities.trades,
    state: state,
})

const mapDispatchToProps = dispatch => {
    return ({
        initializeAssets: trades => dispatch(initializeAssets(trades)),
        fetchQuote: ticker => dispatch(fetchQuote(ticker)),
})}

class Dashboard extends React.Component {

    componentDidMount() {
        this.props.initializeAssets(this.props.trades);
        
    }

    componentDidUpdate() {
        Object.values(this.props.displayedAssets).forEach(asset => {
            if (asset.currentPrice === undefined) {
                this.props.fetchQuote(asset.ticker)
            }
        })
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