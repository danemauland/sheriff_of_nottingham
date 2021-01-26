import React from "react";
import {
    formatToDollar,
    ONE_DAY,
} from "../../../util/dashboard_calcs";
import { 
    calcStrChange,
    chartOptions,
    formatGraphView,
    refreshChartData,
    removeToolTip,
    updateLineColor,
    chartSelectorClassNamesGenerator,
} from "../../../util/chart_utils";
import ChartHeader from "./chart_header";
import ChartSelectors from "./chart_selectors";

class DynamicChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayVal: props.mostRecentVal,
            strChange: "",
            dataPointIndex: -1,
            chartSelected: ONE_DAY,
        };

        this.generateChartChanger = this.generateChartChanger.bind(this);
    }

    componentDidMount() {
        const ctx = $(document.getElementById("myChart"));

        this.lineChart = new Chart(ctx, chartOptions(
            this.props.valueIncreased,
            this.setState.bind(this),
        ));
        
        ctx.data("lineChart", this.lineChart);

        this.handleChartChange();
        this.resetHeader();
    }

    componentDidUpdate(prevProps) {
        this.updateStrChange();

        
        if (prevProps.values !== this.props.values) {
            this.resetHeader(this.handleChartChange.bind(this));
        };

        const valueWasInc = prevProps.valueIncreased;
        const valueInc = this.props.valueIncreased;
        if (valueWasInc !== valueInc) updateLineColor(this.lineChart, valueInc);
    }

    handleChartChange() {
        const {times, values, startValues: {oneDay: oneDayStart}} = this.props;
        const chartSelected = this.state.chartSelected;
        refreshChartData(this.lineChart, times, values, chartSelected, oneDayStart);

        this.checkValueIncreased();
    }

    resetHeader(callback) {
        this.setState({
            dataPointIndex: -1,
            displayVal: this.props.mostRecentVal,
        }, callback);
    }

    calcStrChange() {
        const timesDataset = this.lineChart.data.datasets[2];
        return calcStrChange(this.props, this.state, timesDataset);
    }

    checkValueIncreased() {
        const changeIsPositive = this.calcStrChange()[0] === "+";
        const valueInc = this.props.valueIncreased;
        const updateValueInc = this.props.updateValueIncreased;
        if (changeIsPositive !== valueInc) updateValueInc(!valueInc);
    }

    updateStrChange() {
        let strChange = this.calcStrChange();

        if (this.state.strChange !== strChange) this.setState({strChange});
    }

    chartIsHovered() {
        return this.state.dataPointIndex >= 0;
    }
    
    generateChartChanger(field) {
        return e => {
            e.preventDefault();

            this.setState({
                chartSelected: field,
            }, this.handleChartChange);
        }
    }

    generateTitle() {
        return formatToDollar(this.state.displayVal);
    }

    getGraphView() {
        if (this.chartIsHovered()) return "";
        return formatGraphView(this.state.chartSelected);
    }

    get classNameGenerator() {
        const valInc = this.props.valueIncreased;
        const selectedView = this.state.chartSelected;

        return chartSelectorClassNamesGenerator(valInc, selectedView);
    }

    render() {
        return (
            <div className="chart-wrapper">
                <ChartHeader
                    title={this.generateTitle()}
                    view={this.getGraphView()}
                    change={this.state.strChange}
                />

                <canvas
                    id="myChart"
                    onMouseLeave={() => {
                        this.resetHeader();
                        removeToolTip();
                    }}
                    width="676px"
                    height="196px"
                    display="block"
                />

                <ChartSelectors
                    genClassNames={this.classNameGenerator}
                    genChartChanger={this.generateChartChanger}
                />
            </div>
        )
    }
}

export default DynamicChart;