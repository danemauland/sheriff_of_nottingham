import { updateValueIncreased } from "../../../actions/value_increased_actions";
import DynamicChart from "../chart/dynamic_chart"
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";

const mapStateToProps = (
    {
        newEntities: {
            assetInformation: {candlePrices, candleTimes},
            portfolioHistory: {cashHistory},
        },
        ui: {valueIncreased},
    },
    {ticker},
) => {
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
        valueIncreased,
    })
}

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);