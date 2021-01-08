import { updateValueIncreased } from "../../../actions/value_increased_actions";
import DynamicChart from "../chart/dynamic_chart"
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.match.params.ticker;
    const candlePrices = state.newEntities.assetInformation.candlePrices;
    const candleTimes = state.newEntities.assetInformation.candleTimes;
    const cashHistory = state.newEntities.portfolioHistory.cashHistory;
    const values = {
        oneDay: candlePrices.oneDay[ticker],
        oneWeek: candlePrices.oneWeek[ticker],
        oneYear: candlePrices.oneYear[ticker],
    }
    const times = {
        oneDay: candleTimes.oneDay[ticker],
        oneWeek: candleTimes.oneWeek[ticker],
        oneYear: candleTimes.oneYear[ticker],
    }
    return ({
        startingCashBal: cashHistory.balances[0],
        startingCashTime: cashHistory.times[0],
        mostRecentVal: values.oneDay.last(),
        times,
        values,
        valueIncreased: state.ui.valueIncreased,
    })
}

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
})

const mapped = connect(mapStateToProps, mapDispatchToProps)(DynamicChart);
export default withRouter(mapped);