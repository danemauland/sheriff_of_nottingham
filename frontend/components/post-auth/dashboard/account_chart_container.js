import {
    getStartingCashBal,
    getStartingCashTime,
    getPortfolioValue,
    getPortfolioValuationsTimes,
    getPortfolioValuations,
    getValueIncreased,
} from "../../../util/extract_from_state_utils";
import { updateValueIncreased } from "../../../actions/value_increased_actions";
import DynamicChart from "../chart/dynamic_chart";
import { connect } from "react-redux";

const mapStateToProps = state => ({
    startingCashBal: getStartingCashBal(state),
    startingCashTime: getStartingCashTime(state),
    mostRecentVal: getPortfolioValue(state),
    times: getPortfolioValuationsTimes(state),
    values: getPortfolioValuations(state),
    valueIncreased: getValueIncreased(state),
})

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);