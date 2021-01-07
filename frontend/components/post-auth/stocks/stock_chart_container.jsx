import { updateValueIncreased } from "../../../actions/value_increased_actions";
import { updateChart, chartUpdated } from "../../../actions/chart_selected_actions";
import DynamicChart from "../dynamic_chart"
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state, ownProps) => {
    const ticker = ownProps.match.params.ticker;
    const candlePrices = state.newEntities.assetInformation.candlePrices;
    const candleTimes = state.newEntities.assetInformation.candleTimes;
    if (Object.values(candlePrices).some(prices => prices[ticker] === undefined)) {
        return({ loading: true})
    }
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
        currentPortfolioVal: values.oneDay.last(),
        times,
        values,
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