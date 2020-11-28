import { updateValueIncreased } from "../../actions/value_increased_actions";
import { updateChart, chartUpdated } from "../../actions/chart_selected_actions";
import DynamicChart from "./dynamic_chart"
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.match.params.ticker;
    if (state.entities.displayedAssets[ticker] === undefined) {
        return({ loading: true})
    }
    return ({
        startingCashBal: state.entities.summary.cashHistory.balances[0],
        startingCashTime: state.entities.summary.cashHistory.times[0],
        currentPortfolioVal: state.entities.displayedAssets[ticker].prices.oneDay.last(),
        valueHistoryTimes: state.entities.displayedAssets[ticker].times,
        valueHistoryValues: state.entities.displayedAssets[ticker].prices,
        valueIncreased: state.ui.valueIncreased,
        chartSelected: state.ui.chartSelected,
        update: state.ui.updatesNeeded.chart,
    })
}

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
    updateChart: chartType => dispatch(updateChart(chartType)),
    chartUpdated: () => dispatch(chartUpdated()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DynamicChart));