import { updateValueIncreased } from "../../actions/value_increased_actions";
import { updateChart, chartUpdated } from "../../actions/chart_selected_actions";
import DynamicChart from "./dynamic_chart"
import { connect } from "react-redux";

const mapStateToProps = state => {
    const portfolioHistory = state.newEntities.portfolioHistory;
    const cashHistory = portfolioHistory.cashHistory;
    const valuationHistory = portfolioHistory.valuationHistory;
    return ({
        startingCashBal: cashHistory.balances[0],
        startingCashTime: cashHistory.times[0],
        currentPortfolioVal: valuationHistory.valuations.oneDay.last(),
        times: valuationHistory.times,
        values: valuationHistory.valuations,
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