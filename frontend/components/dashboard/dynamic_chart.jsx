import React from "react";
import {
    formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "../../util/dashboard_calcs";
import { 
    getPreviousEndingValue,
    getStrChange,
    getTimesArray,
    getLabelsArray,
    getDatasets,
    chartOptions,
    graphView,
} from "../../util/chart_utils";
import { withRouter } from "react-router-dom";

Chart.defaults.global.animation.duration = 0;

class DynamicChart extends React.Component {
    constructor(props) {

        super(props)
        this.state = {
            view: "",
            display: this.props.currentPortfolioVal,
            strChange: "",
            dataPointIndex: -1,
            times: [],
            labels: [],
            datasets: [],
        }

        this.checkUpdate = true;
        this.resetHeader = this.resetHeader.bind(this);
        this.hideGraphView = this.hideGraphView.bind(this);
    }

    hideGraphView() {
        $(".graph-view").addClass("hidden");
        this.checkUpdate = false;
    }

    getCurrentVal() {
        return (this.state.display === undefined ?
            this.props.currentPortfolioVal :
            this.state.display
        );
    }

    resetHeader() {
        $(".graph-view").removeClass("hidden");
        $("#chartjs-tooltip").remove();

        const boundUpdateStrChange = this.updateStrChange.bind(this);

        this.setState({
            dataPointIndex: -1,
            display: this.props.currentPortfolioVal
        }, boundUpdateStrChange((strChange) => {
            return () => {
                if ((strChange[0] === "+") !== this.props.valueIncreased) {
                    this.props.updateValueIncreased(!this.props.valueIncreased)
                    this.lineChart.data.datasets[0].borderColor = (!this.props.valueIncreased ? "rgba(0,200,5,1)" : "rgba(255,80,0,1)");
                    this.lineChart.data.datasets[1].borderColor = (!this.props.valueIncreased ? "rgba(0,200,5,0.5)" : "rgba(255,80,0,0.5)");
                    this.lineChart.update();
                }
            }
        }))
        
    }

    componentDidMount() {
        if (this.props.loading) return;
            const ctx = document.getElementById("myChart");
            this.lineChart = new Chart(ctx, chartOptions(
                this.props.valueIncreased,
                this.setState.bind(this),
            ));
        this.handleChartChange();
    }
    
    updateStrChange(callback = () => {}) {
        let strChange;
        let startVal = getPreviousEndingValue(
            this.props.valueHistoryValues.oneYear,
            this.props.chartSelected
        );
        if (startVal) {
            strChange = getStrChange(startVal, this.getCurrentVal())
        } else {
            startVal = this.props.startingCashBal;
            if (this.state.dataPointIndex < 0 || this.props.startingCashTime < this.state.times[this.state.dataPointIndex]) {
                strChange = getStrChange(startVal, this.getCurrentVal());
            } else {
                strChange = getStrChange(0, 0)
            }
        }
        if (this.state.strChange !== strChange) {
            this.setState({
                strChange,
            }, callback(strChange))
        }
    }

    handleChartChange() {

        const times = getTimesArray(this.props.valueHistoryTimes,
            this.props.chartSelected
        );

        const labels = getLabelsArray(times, this.props.chartSelected);

        const datasets = getDatasets(
            this.props.valueHistoryValues,
            this.props.chartSelected
        );

        // Update chart data, have to mutate, cannot reassign
        while (this.lineChart.data.labels.length > 0) {
            this.lineChart.data.labels.pop();
        }
        for (let i = 0; i < labels.length; i++) {
            this.lineChart.data.labels.push(labels[i])
        }
        this.lineChart.data.datasets.forEach(set => {
            while (set.data.length > 0) {
                set.data.pop()
            }
        })
        for (let i = 0; i < datasets.length; i++) {
            for (let j = 0; j < datasets[i].length; j++) {
                this.lineChart.data.datasets[i].data.push(datasets[i][j])
            }
        }

        const flat = datasets.flat().filter(ele => ele !== undefined);
        let max = Math.max(...flat);
        let min = Math.min(...flat);
        const delta = max - min;
        max = max + delta * 0.01;
        min = min - delta * 0.01;
        this.lineChart.chart.options.scales.yAxes[0].ticks.max = max;
        this.lineChart.chart.options.scales.yAxes[0].ticks.min = min;
        
        
        this.lineChart.update();
        
        this.setState({
            times,
            labels,
            datasets,
            view: this.props.chartSelected,
        }, this.resetHeader);


        this.props.chartUpdated();

    }

    componentDidUpdate() {
        if (this.props.loading) return;
        
        if (this.props.update) {
            this.handleChartChange()
        }
            
        
        this.updateStrChange()
        
    }

    generateChartChanger(field) {
        return e => {
            e.preventDefault();
            this.props.updateChart(field);
        }
    }

    generateClassNames(type) {
        let classNames = "chart-selector-link ";
        classNames += (this.props.valueIncreased ? "dark-green-hover " : "red-hover ");
        if (type === this.props.chartSelected) {
            classNames += (this.props.valueIncreased ? "chart-selector-link-selected-green " : "chart-selector-link-selected-red ")
        }
        return classNames;
    }

    render() {
        if (this.props.loading) return <></>;
        return (
            <div className="chart-wrapper">
                <header className="chart-header">
                    <h1 className="dashboard-title">{formatToDollar(this.state.display === undefined ?
                        this.props.currentPortfolioVal :
                        this.state.display)}</h1>
                    <div className="chart-header-subinfo">
                        <p>{this.state.strChange} <span className="graph-view">{graphView(this.props.chartSelected)}</span></p>
                    </div>
                </header>
                <canvas id="myChart" onMouseEnter={this.hideGraphView} onMouseLeave={this.resetHeader} width="676px" height="196px" display="block"></canvas>
                <div className="chart-selector-spacer">
                    <div className="chart-selector-flex-container">
                        <a className={this.generateClassNames(ONE_DAY)} onClick={this.generateChartChanger(ONE_DAY)}><div className="chart-selector-link-text">1D</div></a>
                        <a className={this.generateClassNames(ONE_WEEK)} onClick={this.generateChartChanger(ONE_WEEK)}><div className="chart-selector-link-text">1W</div></a>
                        <a className={this.generateClassNames(ONE_MONTH)} onClick={this.generateChartChanger(ONE_MONTH)}><div className="chart-selector-link-text">1M</div></a>
                        <a className={this.generateClassNames(THREE_MONTH)} onClick={this.generateChartChanger(THREE_MONTH)}><div className="chart-selector-link-text">3M</div></a>
                        <a className={this.generateClassNames(ONE_YEAR)} onClick={this.generateChartChanger(ONE_YEAR)}><div className="chart-selector-link-text">1Y</div></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(DynamicChart);