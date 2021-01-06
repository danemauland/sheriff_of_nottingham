import StockContent from "./stock_content";
import StockSidebar from "./stock_sidebar";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isStockLoaded } from "../../../util/dashboard_calcs";


const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.match.params.ticker;
    return {
        loading: !isStockLoaded(ticker, state),
        ticker,
    
    }
}


class Stock extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {
        if (this.props.loading) {
            return <></>
        }
        return (
            <>
                <StockContent ticker={this.props.ticker}/>
                <StockSidebar ticker={this.props.ticker}/>
            </>
        )
    }
}

export default withRouter(connect(mapStateToProps, null)(Stock));