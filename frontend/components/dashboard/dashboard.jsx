import React from "react";
import {Link} from "react-router-dom";
import Header from "./header";
import {fetchQuote, initializeAssets} from "../../actions/external_api_actions";
import {connect} from "react-redux";

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
            </>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)