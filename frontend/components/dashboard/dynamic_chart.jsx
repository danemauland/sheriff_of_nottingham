import React from "react";
import {
    formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "../../util/dashboard_calcs";
import { updateValueIncreased } from "../../actions/value_increased_actions";
import {updateChart, chartUpdated} from "../../actions/chart_selected_actions";
import { connect } from "react-redux";
import { 
    getPreviousEndingValue,
    getStrChange,
    getTimesArray,
    getLabelsArray,
    getDatasets,
} from "../../util/chart_utils";

const mapStateToProps = state => {
    return ({
        username: state.session.username,
        cashBal: state.entities.summary.cashHistory.balances[state.entities.summary.cashHistory.balances.length - 1],
        startingCashBal: state.entities.summary.cashHistory.balances[0],
        startingCashTime: state.entities.summary.cashHistory.times[0],
        portfolioVal: state.entities.summary.valueHistory.values.oneDay[state.entities.summary.valueHistory.values.oneDay.length - 1],
        valueHistory: state.entities.summary.valueHistory,
        trades: state.entities.trades,
        displayedAssets: state.entities.displayedAssets,
        valueIncreased: state.ui.valueIncreased,
        chartSelected: state.ui.chartSelected,
        update: state.ui.updatesNeeded.chart,
        oneYearValues: state.entities.summary.valueHistory.values.oneYear,
    })
}

const mapDispatchToProps = dispatch => ({
    updateValueIncreased: bool => dispatch(updateValueIncreased(bool)),
    updateChart: chartType => dispatch(updateChart(chartType)),
    chartUpdated: () => dispatch(chartUpdated()),
})

Chart.Tooltip.positioners.custom = (elements, position) => {
    if (elements.length === 0) return false;
    return {
        x: position.x,
        y: 9,
    }
}

class DynamicChart extends React.Component {
    constructor(props) {

        super(props)
        
        this.state = {
            view: "",
            display: this.props.portfolioVal,
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
            this.props.portfolioVal :
            this.state.display
        );
    }

    resetHeader() {
        $(".graph-view").removeClass("hidden");
        $("#chartjs-tooltip").remove();

        let startVal = getPreviousEndingValue(this.props.oneYearValues, this.props.chartSelected)
        startVal ||= this.props.startingCashBal;
        let strChange = getStrChange(startVal, this.getCurrentVal())
        
        this.setState({
            display: this.props.portfolioVal,
            strChange,
        })
    }

    calcChange() {
        let pastVal;
        let delta;
        let sign;
        let strChange = "";
        let percentage;
        switch (this.props.chartSelected) {
            case ONE_DAY:
                pastVal = this.props.valueHistory.values.oneYear[this.props.valueHistory.values.oneYear.length - 3];
                break;
            case ONE_WEEK:
                pastVal = this.props.valueHistory.values.oneYear[this.props.valueHistory.values.oneYear.length - 9];
                break;
            case ONE_MONTH:
                pastVal = this.props.valueHistory.values.oneYear[this.props.valueHistory.values.oneYear.length - 32];
                break;
            case THREE_MONTH:
                pastVal = this.props.valueHistory.values.oneYear[this.props.valueHistory.values.oneYear.length - 92];
                break;
            case ONE_YEAR:
                pastVal = this.props.valueHistory.values.oneYear[0];
                break;
            default:
                break;
        }
        let subtractant = (this.state.display === undefined ?
            this.props.portfolioVal :
            this.state.display
        );
        let subtractor = pastVal;
        delta = subtractant - subtractor;
        this.delta = delta;
        if (this.checkUpdate) {
            if (this.props.valueIncreased != this.delta >= 0) {
                this.props.updateValueIncreased(this.delta >= 0);
            }
        }
        sign = (delta < 0 ? "-" : "+");
        delta = Math.abs(delta);
        let base = (pastVal || this.props.startingCashBal);
        percentage = (delta === 0 ? 0 : delta / base);
        percentage = (percentage * 100).toFixed(2);
        strChange += sign;
        strChange += formatToDollar(delta);
        strChange += ` (${sign}${percentage}%)`;
        if (this.state.strChange !== strChange) {
            this.setState({
                change: strChange,
            })
        }
        return strChange;
    }

    graphView() {
        switch (this.props.chartSelected) {
            case ONE_DAY:
                return "Today";
            case ONE_WEEK:
                return "Past Week";
            case ONE_MONTH:
                return "Past Month";
            case THREE_MONTH:
                return "Past 3 Months";
            case ONE_YEAR:
                return "Past Year";
            default:
                break;
        }
    }

    componentDidMount() {
        const tooltipFunction = () => {
            const setState = this.setState.bind(this);
            return function (tooltipModel) {
                if (tooltipModel.dataPoints === undefined) return;
                if (tooltipModel.dataPoints[0] === undefined) return;
                let tooltipEl = document.getElementById("chartjs-tooltip");
                let tooltipTitle = document.getElementById("chartjs-tooltip-title");
                let tooltipLine = document.getElementById("chartjs-tooltip-line");
                let tooltipCircle = document.getElementById("chartjs-tooltip-circle");
                if (!tooltipEl) {
                    tooltipEl = document.createElement("div");
                    tooltipEl.id = "chartjs-tooltip";
                    tooltipTitle = document.createElement("div");
                    tooltipTitle.id = "chartjs-tooltip-title";
                    tooltipLine = document.createElement("div");
                    tooltipLine.id = "chartjs-tooltip-line";
                    tooltipCircle = document.createElement("div");
                    tooltipCircle.id = "chartjs-tooltip-circle";
                    tooltipEl.appendChild(tooltipTitle);
                    tooltipEl.appendChild(tooltipLine);
                    tooltipEl.appendChild(tooltipCircle);
                    document.body.appendChild(tooltipEl);
                }

                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
                if (tooltipModel.dataPoints[0]) {
                    setState({
                        display: Math.floor(tooltipModel.dataPoints[0].yLabel * 100),
                        dataPointIndex: tooltipModel.dataPoints[0].index,
                    })
                }
                const position = this._chart.canvas.getBoundingClientRect();
                tooltipTitle.innerHTML = tooltipModel.title;
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipLine.style.height = position.bottom - position.top + "px";
                tooltipLine.style.width = 0 + "px";
                tooltipLine.style.borderRight = "1px solid rgba(121,133,139,1)";
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - (tooltipTitle.offsetWidth / 2) + 'px';
                tooltipEl.style.top = position.top - 20 + 'px';
                tooltipLine.style.position = "absolute";
                tooltipLine.style.top = "20px"
                tooltipCircle.style.position = "absolute";
                tooltipCircle.style.top = tooltipModel.dataPoints[0].y + 14 + 'px';
                tooltipCircle.style.backgroundColor = this._data.datasets[0].borderColor;
                tooltipCircle.style.width = "8px";
                tooltipCircle.style.height = "8px";
                tooltipCircle.style.borderRadius = "8px";
                tooltipCircle.style.border = "2px solid black";
                tooltipEl.style.pointerEvents = 'none';
            }
        }
        const ctx = document.getElementById("myChart");
        this.lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        data: [],
                        borderColor: (this.props.valueIncreased ? "rgba(0,200,5,1)" : "rgba(255,80,0,1)"),
                        backgroundColor: "transparent",
                        borderWidth: 2,
                    },
                    {
                        data: [],
                        borderColor: (this.props.valueIncreased ? "rgba(0,200,5,0.5)" : "rgba(255,80,0,0.5)"),
                        backgroundColor: "transparent",
                        borderWidth: 2,
                    },
                    {
                        data: [],
                        borderColor: "transparent",
                        backgroundColor: "transparent",
                        pointStyle: "line",
                        pointRotation: 90,
                        pointRadius: 2,
                        pointHoverRadius: 2,
                        pointBorderColor: "rgba(121,133,139,1)",
                    },
                    {
                        data: [],
                        borderColor: "transparent",
                        backgroundColor: "transparent",
                        pointStyle: "line",
                        pointRotation: 90,
                        pointRadius: 2,
                        pointHoverRadius: 2,
                        pointBorderColor: "rgba(121,133,139,0.5)",
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                elements: {
                    point: {
                        mode: "index",
                        intersect: false,
                        radius: 0,
                        hoverRadius: 0,
                    },
                    line: {
                        tension: 0,
                    },
                },
                legend: { display: false },
                title: { display: false },
                scales: {
                    yAxes: [{
                        display: false,
                    }],
                    xAxes: [{
                        display: false,
                    }]
                },
                tooltips: {
                    enabled: false,
                    custom: tooltipFunction(),
                    mode: "index",
                    intersect: false,
                    titleFontColor: "rgba(121,133,139,1)",
                    filter: function (tooltipItem) {
                        return tooltipItem.datasetIndex < 2;
                    }
                },
                hover: {
                    mode: "index",
                    intersect: false,
                }
            }
        })
        this.handleChartChange();
    }
    
    updateStrChange() {
        let strChange;
        let startVal = getPreviousEndingValue(this.props.oneYearValues, this.props.chartSelected);
        if (startVal) {
            strChange = getStrChange(startVal, this.getCurrentVal())
        } else {
            startVal = this.props.startingCashBal;
            if (this.props.startingCashTime < this.state.times[this.state.dataPointIndex]) {
                strChange = getStrChange(startVal, this.getCurrentVal());
            } else {
                strChange = getStrChange(0, 0)
            }
        }
        if (this.state.strChange !== strChange) {
            this.setState({
                strChange,
            })
        }
    }

    handleChartChange() {

        const times = getTimesArray(this.props.valueHistory.times,
            this.props.chartSelected
        );

        const labels = getLabelsArray(times, this.props.chartSelected);

        const datasets = getDatasets(
            this.props.valueHistory.values,
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
        this.lineChart.chart.options.scales.yAxes[0].ticks.max = Math.max(...flat) + 1;
        this.lineChart.chart.options.scales.yAxes[0].ticks.min = Math.min(...flat) - 1;

        this.lineChart.data.datasets[0].borderColor = (this.props.valueIncreased ? "rgba(0,200,5,1)" : "rgba(255,80,0,1)");
        this.lineChart.data.datasets[1].borderColor = (this.props.valueIncreased ? "rgba(0,200,5,0.5)" : "rgba(255,80,0,0.5)");
        this.lineChart.update();
        
        this.setState({
            times,
            labels,
            datasets,
            view: this.props.chartSelected,
        });

        this.props.chartUpdated();
    }

    componentDidUpdate() {
        
        this.updateStrChange()
        
        if (this.props.update) this.handleChartChange();
        
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
        return (
            <div className="chart-wrapper">
                <header className="chart-header">
                    <h1>{formatToDollar(this.state.display === undefined ?
                        this.props.portfolioVal :
                        this.state.display)}</h1>
                    <div className="chart-header-subinfo">
                        <p>{this.state.strChange} <span className="graph-view">{this.graphView()}</span></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(DynamicChart);