import React from "react";
import {formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "../../util/dashboard_calcs";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({
        username: state.session.username,
        cashBal: state.entities.summary.cashHistory.balances[state.entities.summary.cashHistory.balances.length - 1],
        startingCashBal: state.entities.summary.cashHistory.balances[0],
        portfolioVal: state.entities.summary.valueHistory.values.oneDay[state.entities.summary.valueHistory.values.oneDay.length - 1],
        valueHistory: state.entities.summary.valueHistory,
        trades: state.entities.trades,
        displayedAssets: state.entities.displayedAssets,
    })
}

Chart.Tooltip.positioners.custom = (elements, position) => {
    if (elements.length === 0) return false;
    return {
        x: position.x,
        y: 9,
    }
}

class AccountSummaryHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: ONE_DAY,
            display: this.props.portfolioVal,
        }
        this.resetHeader = this.resetHeader.bind(this)
        this.hideGraphView = this.hideGraphView.bind(this)
    }

    hideGraphView() {
        $(".graph-view").addClass("hidden");
    }

    resetHeader() {
        $(".graph-view").removeClass("hidden");
        $("#chartjs-tooltip").remove();
        this.setState({
            display: this.props.portfolioVal,
        })
    }

    calcChange() {
        let pastVal;
        let delta;
        let sign;
        let strChange = "";
        let percentage;
        switch (this.state.view) {
            case ONE_DAY:
                pastVal = this.props.valueHistory.values.oneYear[this.props.valueHistory.values.oneYear.length - 2];
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
        sign = (delta < 0 ? "-" : "+");
        delta = Math.abs(delta);
        let base = (pastVal || this.props.startingCashBal);
        percentage = (delta === 0 ? 0 : delta / base);
        percentage = (percentage * 100).toFixed(2);
        strChange += sign;
        strChange += formatToDollar(delta);
        strChange += ` (${sign}${percentage}%)`;
        return strChange;
    }

    graphView() {
        switch (this.state.view) {
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

    formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = (hours > 11 ? "PM" : "AM")
        if (minutes < 10) minutes = `0${minutes}`;
        if (hours > 12) hours = hours % 12;
        return `${hours}:${minutes} ${ampm}`
    }

    parseMonth(date) {
        switch (date.getMonth()) {
            case 0:
                return "JAN";
            case 1:
                return "FEB";
            case 2:
                return "MAR";
            case 3:
                return "APR";
            case 4:
                return "MAY";
            case 5:
                return "JUN";
            case 6:
                return "JUL";
            case 7:
                return "AUG";
            case 8:
                return "SEP";
            case 9:
                return "OCT";
            case 10:
                return "NOV";
            case 11:
                return "DEC";
            default:
                break;
        }
    }

    formatDateTime(date) {
        const month = this.parseMonth(date);
        const day = date.getDate();
        return `${month} ${day}, ${this.formatTime(date)}`
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
                        borderColor: (this.pastVal > this.props.portfolioVal ? "rgba(255,80,0,1)" : "rgba(0,200,5,1)"),
                        backgroundColor: "transparent",
                        borderWidth: 2,
                    },
                    {
                        data: [],
                        borderColor: (this.pastVal > this.props.portfolioVal ? "rgba(255,80,0,0.5)" : "rgba(0,200,5,0.5)"),
                        backgroundColor: "transparent",
                        borderWidth: 2,
                    },
                    {
                        data: [],
                        borderColor: "transparent",
                        backgroundColor: "transparent",
                        pointStyle: "line",
                        pointRotation: 90,
                        pointRadius: 1,
                        pointHoverRadius: 1,
                        pointBorderColor: "rgba(121,133,139,1)",
                    },
                    {
                        data: [],
                        borderColor: "transparent",
                        backgroundColor: "transparent",
                        pointStyle: "line",
                        pointRotation: 90,
                        pointRadius: 1,
                        pointHoverRadius: 1,
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
                title: {display: false},
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
                    filter: function(tooltipItem) {
                        return tooltipItem.datasetIndex < 2;
                    }
                },
                hover: {
                    mode: "index",
                    intersect: false,
                }
            }
        })
    }

    componentDidUpdate() {
        let inMarketHoursData = [];
        let outMarketHoursData = [];
        let labels;
        let inMarketHoursPastVals = [];
        let outMarketHoursPastVals = [];
        switch (this.state.view) {
            case ONE_DAY:
                let times = [];
                let startTime = this.props.valueHistory.times.oneDay[0];
                for(let i = 6; i > 0; i--) {
                    times.push(startTime - (5 * 60 * i))
                }
                times = times.concat(this.props.valueHistory.times.oneDay)
                while (times.length < 109) {
                    const newTime = times[times.length - 1] + (5 * 60)
                    times.push(newTime)
                }
                for(let i = 0; i < 6; i++) {
                    outMarketHoursData.push(this.props.valueHistory.values.oneDay[0] / 100);
                    inMarketHoursData.push(undefined);
                }
                this.props.valueHistory.values.oneDay.forEach(val => {
                    outMarketHoursData.push(undefined);
                    inMarketHoursData.push(val / 100);
                });
                outMarketHoursData.pop()
                outMarketHoursData[6] = this.props.valueHistory.values.oneDay[0] / 100;
                if (inMarketHoursData.length === 85) {
                    for(let i = 84; i < 109; i++) {
                        if (times[i] < new Date().getTime() / 1000) {
                            outMarketHoursData.push(inMarketHoursData[inMarketHoursData.length - 1])
                        }
                    }
                }
                const pastVal = this.props.valueHistory.values.oneYear[this.props.valueHistory.values.oneYear.length - 2] / 100;
                for(let i = 0; i < 109; i++) {
                    if (i > 6 && i < 85) {
                        inMarketHoursPastVals.push(pastVal)
                        outMarketHoursPastVals.push(undefined)
                    } else {
                        inMarketHoursPastVals.push(undefined)
                        outMarketHoursPastVals.push(pastVal)
                    }
                }
                labels = times.map(time => (
                    this.formatTime(new Date(time * 1000))
                ))
                break;
            case ONE_WEEK:
                labels = this.props.valueHistory.times.oneWeek.map(time => (
                    this.formatDateTime(new Date(time * 1000))
                ))
                inMarketHoursData = this.props.valueHistory.values.oneWeek.map(val => (
                    val / 100
                ));
                break;
            case ONE_MONTH:
                labels = this.props.valueHistory.times.oneYear.slice(
                    this.props.valueHistory.times.oneYear.length - 32,
                    this.props.valueHistory.times.oneYear.length
                ).map(time => (
                    this.formatDateTime(new Date(time * 1000))
                ))
                inMarketHoursData = this.props.valueHistory.values.oneYear.slice(
                    this.props.valueHistory.values.oneYear.length - 32,
                    this.props.valueHistory.values.oneYear.length
                ).map(val => (
                    val / 100
                ));
                break;
            case THREE_MONTH:
                labels = this.props.valueHistory.times.oneYear.slice(
                    this.props.valueHistory.times.oneYear.length - 92,
                    this.props.valueHistory.times.oneYear.length
                ).map(time => (
                    this.formatDateTime(new Date(time * 1000))
                ))
                inMarketHoursData = this.props.valueHistory.values.oneYear.slice(
                    this.props.valueHistory.values.oneYear.length - 92,
                    this.props.valueHistory.values.oneYear.length
                ).map(val => (
                    val / 100
                ));
                break;
            case ONE_YEAR:
                labels = this.props.valueHistory.times.oneYear.map(time => (
                    this.formatDateTime(new Date(time * 1000))
                ))
                inMarketHoursData = this.props.valueHistory.values.oneYear.map(val => (
                    val / 100
                ));
                break;
            default:
                break;
        }
        this.lineChart.data.datasets.forEach(set => {
            while (set.data.length > 0) {
                set.data.pop()
            }
        })
        while (this.lineChart.data.labels.length > 0) {
            this.lineChart.data.labels.pop();
        }
        for(let i = 0; i < inMarketHoursData.length; i++) {
            this.lineChart.data.datasets[0].data.push(inMarketHoursData[i])
        }
        for (let i = 0; i < outMarketHoursData.length; i++) {
            this.lineChart.data.datasets[1].data.push(outMarketHoursData[i])
        }
        for (let i = 0; i < inMarketHoursPastVals.length; i++) {
            this.lineChart.data.datasets[2].data.push(inMarketHoursPastVals[i])
        }
        for (let i = 0; i < outMarketHoursPastVals.length; i++) {
            this.lineChart.data.datasets[3].data.push(outMarketHoursPastVals[i])
        }
        for (let i = 0; i < labels.length; i++) {
            this.lineChart.data.labels.push(labels[i])
        }
        this.lineChart.chart.options.scales.yAxes[0].ticks.max = Math.max(...inMarketHoursData.concat(outMarketHoursData).concat(inMarketHoursPastVals).filter(ele => ele !== undefined)) + 1
        this.lineChart.chart.options.scales.yAxes[0].ticks.min = Math.min(...inMarketHoursData.concat(outMarketHoursData).concat(inMarketHoursPastVals).filter(ele => ele !== undefined)) - 1
        this.lineChart.data.datasets[0].borderColor = (this.pastVal > this.props.portfolioVal ? "rgba(255,80,0,1)" : "rgba(0,200,5,1)");
        this.lineChart.data.datasets[1].borderColor = (this.pastVal > this.props.portfolioVal ? "rgba(255,80,0,0.5)" : "rgba(0,200,5,0.5)");
        this.lineChart.update();
    }

    generateChartChanger(field) {
        return e => {
            e.preventDefault();
            $(".chart-selector-link-selected").removeClass("chart-selector-link-selected")
            $(e.currentTarget).addClass("chart-selector-link-selected")
            this.setState({
                view: field,
            })
        }
    }

    render() {
        return (
            <>
                <header className="account-summary-header">
                    <h1>{formatToDollar(this.state.display === undefined ?
                        this.props.portfolioVal :
                        this.state.display)}</h1>
                    <div className="account-summary-header-subinfo">
                        <p>{this.calcChange()} <span className="graph-view">{this.graphView()}</span></p>
                    </div>
                </header>
                <canvas id="myChart" onMouseEnter={this.hideGraphView} onMouseLeave={this.resetHeader} width="676px" height="196px" display="block"></canvas>
                <div className="chart-selector-spacer">
                    <div className="chart-selector-flex-container">
                        <a className="chart-selector-link chart-selector-link-selected" onClick={this.generateChartChanger(ONE_DAY)}><div className="chart-selector-link-text">1D</div></a>
                        <a className="chart-selector-link" onClick={this.generateChartChanger(ONE_WEEK)}><div className="chart-selector-link-text">1W</div></a>
                        <a className="chart-selector-link" onClick={this.generateChartChanger(ONE_MONTH)}><div className="chart-selector-link-text">1M</div></a>
                        <a className="chart-selector-link" onClick={this.generateChartChanger(THREE_MONTH)}><div className="chart-selector-link-text">3M</div></a>
                        <a className="chart-selector-link" onClick={this.generateChartChanger(ONE_YEAR)}><div className="chart-selector-link-text">1Y</div></a>
                    </div>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, null)(AccountSummaryHeader);