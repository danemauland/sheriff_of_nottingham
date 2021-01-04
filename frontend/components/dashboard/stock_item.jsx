import {Link} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
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

const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.ticker;
    const prevEndValue = getPreviousEndingValue(state.entities.displayedAssets[ticker].prices.oneYear, ONE_DAY);
    const lastPrice = state.entities.displayedAssets[ticker].prices.oneDay.last();
    return {
        strChange: getStrChange(prevEndValue, lastPrice),
        numShares: state.entities.assetInformation.ownershipHistories.numShares[ticker].last(),
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