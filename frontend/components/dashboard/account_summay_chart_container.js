import { updateValueIncreased } from "../../actions/value_increased_actions";
import { updateChart, chartUpdated } from "../../actions/chart_selected_actions";
import DynamicChart from "./dynamic_chart"
import { connect } from "react-redux";

const mapStateToProps = state => {
    const portfolioHistory = state.newEntities.portfolioHistory;
    return ({
        startingCashBal: portfolioHistory.cashHistory[1][0],
        startingCashTime: portfolioHistory.cashHistory[0][0],
        currentPortfolioVal: state.entities.summary.valueHistory.values.oneDay.last(),
        valueHistoryTimes: state.entities.summary.valueHistory.times,
        valueHistoryValues: state.entities.summary.valueHistory.values,
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

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);