import { updateValueIncreased } from "../../../actions/value_increased_actions";
import DynamicChart from "../chart/dynamic_chart"
import { connect } from "react-redux";
import {
    getStartingCashBal,
    getValueIncreased,
    getLastPrice,
    getStartingCashTime,
    getAllTickerPrices,
    getTimes
} from "../../../util/extract_from_state_utils";

const mapStateToProps = (state, {ticker}) => ({
    startingCashBal: getStartingCashBal(state),
    startingCashTime: getStartingCashTime(state),
    mostRecentVal: getLastPrice(state, ticker),
    times: getTimes(state),
    values: getAllTickerPrices(state, ticker),
    valueIncreased: getValueIncreased(state),
})

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);