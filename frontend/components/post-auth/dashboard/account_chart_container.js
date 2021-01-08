import { updateValueIncreased } from "../../../actions/value_increased_actions";
import DynamicChart from "../chart/dynamic_chart";
import { connect } from "react-redux";

const mapStateToProps = state => {
    const portfolioHistory = state.newEntities.portfolioHistory;
    const cashHistory = portfolioHistory.cashHistory;
    const valuationHistory = portfolioHistory.valuationHistory;
    const values = valuationHistory.valuations;
    return ({
        startingCashBal: cashHistory.balances[0],
        startingCashTime: cashHistory.times[0],
        mostRecentVal: values.oneDay.last(),
        times: valuationHistory.times,
        values,
        valueIncreased: state.ui.valueIncreased,
    })
}

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);