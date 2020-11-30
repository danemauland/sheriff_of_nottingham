import {Link} from "react-router-dom";
import React from "react";
import {getStrChange,
    getPreviousEndingValue
} from "../../util/chart_utils";
import {
    formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "../../util/dashboard_calcs";

class StockItem extends React.Component {
    getPrevEndValue() {
        return getPreviousEndingValue(this.props.stock.prices.oneYear, ONE_DAY)
    }
    getStrChange() {
        return getStrChange(this.getPrevEndValue(), this.props.stock.prices.oneDay.last())
    }
    render() {
        return (
            <Link to={"/dashboard/stocks/" + this.props.stock.ticker} className="position-item">
                <h4>{this.props.stock.ticker}</h4>
                <span>{
                    this.props.stock.ownershipHistory.numShares.last() !== 1 ?
                        "" + this.props.stock.ownershipHistory.numShares.last() + " Shares" :
                        "" + this.props.stock.ownershipHistory.numShares.last() + " Share" 
                    }
                </span>
                <span className={this.getStrChange()[0] === "+" ? "green" : "red"}>{this.getStrChange()}</span>
            </Link>            
        )
    }
}

export default StockItem;