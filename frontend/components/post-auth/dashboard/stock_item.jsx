import {Link} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
import {getStrChange,
} from "../../../util/chart_utils";
import {
    getPreviousEndingValue,
    formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "../../../util/dashboard_calcs";
import {
    getSharesOwned,
    getLastPrice,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = (state, {ticker}) => {
    const prevDayClose = getPrevDayClose(state, ticker);
    const lastPrice = getLastPrice(state, ticker);
    return {
        strChange: getStrChange(prevDayClose, lastPrice),
        numShares: getSharesOwned(state, ticker),
    }
}

// class StockItem extends React.Component {
    // getPrevEndValue() {
    //     return getPreviousEndingValue(this.props.stock.prices.oneYear, ONE_DAY)
    // }
    // getStrChange() {
    //     return getStrChange(this.getPrevEndValue(), this.props.stock.prices.oneDay.last())
    // }
//     render() {
//         return (
//             <Link to={"/dashboard/stocks/" + this.props.ticker} className="position-item">
//                 <h4>{this.props.stock.ticker}</h4>
//                 <span>{
//                     this.props.stock.ownershipHistory.numShares.last() !== 1 ?
//                         "" + this.props.stock.ownershipHistory.numShares.last() + " Shares" :
//                         "" + this.props.stock.ownershipHistory.numShares.last() + " Share" 
//                     }
//                 </span>
//                 <span className={this.getStrChange()[0] === "+" ? "green" : "red"}>{this.getStrChange()}</span>
//             </Link>            
//         )
//     }
// }

const StockItem = ({ticker, numShares, strChange}) => (
    <Link to={"/dashboard/stocks/" + ticker} className="position-item">
        <h4>{ticker}</h4>
        <span>{"" + numShares + " Share" + (numShares !== 1 ?" s" : "")}</span>
        <span className={strChange[0] === "+" ? "green" : "red"}>
            {strChange}
        </span>
    </Link>  
)

export default connect(mapStateToProps, null)(StockItem);