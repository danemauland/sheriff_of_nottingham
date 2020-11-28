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
                <StockContent />
                <StockSidebar />
            </>
        )
    }
}

export default Stock;