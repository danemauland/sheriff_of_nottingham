import {
    getStartingCashBal,
    getStartingCashTime,
    getPortfolioValue,
    getTimes,
    getPortfolioValuations,
    getValueIncreased,
    getStartValuations,
} from "../../../util/extract_from_state_utils";
import { updateValueIncreased } from "../../../actions/value_increased_actions";
import DynamicChart from "../chart/dynamic_chart";
import { connect } from "react-redux";

const mapStateToProps = state => ({
    startingCashBal: getStartingCashBal(state),
    startingCashTime: getStartingCashTime(state),
    mostRecentVal: getPortfolioValue(state),
    times: getTimes(state),
    values: getPortfolioValuations(state),
    valueIncreased: getValueIncreased(state),
    startValues: getStartValuations(state),
});

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);