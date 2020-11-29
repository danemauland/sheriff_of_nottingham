import StockContent from "./stock_content";
import StockSidebar from "./stock_sidebar";
import React from "react";

class Stock extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <>
                <StockContent ticker={this.props.ticker}/>
                <StockSidebar ticker={this.props.ticker}/>
            </>
        )
    }
}

export default Stock;