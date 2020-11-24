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
        y: 0,
    }
}

class AccountSummaryHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: ONE_WEEK,
            display: 0,
        }
        this.resetHeader = this.resetHeader.bind(this)
        this.hideGraphView = this.hideGraphView.bind(this)
    }

    hideGraphView() {
        $(".graph-view").addClass("hidden");
    }

    resetHeader() {
        $(".graph-view").removeClass("hidden");
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
        delta = (this.state.display || this.props.portfolioVal) - pastVal;
        this.delta = delta;
        sign = (delta < 0 ? "-" : "+");
        delta = Math.abs(delta);
        percentage = ((delta / pastVal) * 100).toFixed(2);
        strChange += sign
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
        const ctx = document.getElementById("myChart");
        this.lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    borderColor: (this.delta < 0 ? "rgba(255,80,0,1)" : "rgba(0,200,5,1)"),
                    backgroundColor: "transparent",
                    hoverRadius: 20,
                    radius: 0,
                }],
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{
                        display: false,
                    }],
                    xAxes: [{
                        display: false,
                    }]
                },
                tooltips: {
                    yAlign: "top",
                    mode: "index",
                    intersect: false,
                    backgroundColor: "transparent",
                    titleFontColor: "rgba(121,133,139,1)",
                    titleFontSize: 13,
                    position: "custom",
                    callbacks: {
                        label: context => {
                            this.setState({
                                display: context.yLabel * 100,
                            });
                            return "";
                        }
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
        let data;
        let labels;
        switch (this.state.view) {
            case ONE_DAY:
                labels = this.props.valueHistory.times.oneDay.map(time => (
                    this.formatTime(new Date(time * 1000))
                ))
                data = this.props.valueHistory.values.oneDay.map(val => (
                    val / 100
                ));
                break;
            case ONE_WEEK:
                labels = this.props.valueHistory.times.oneWeek.map(time => (
                    this.formatDateTime(new Date(time * 1000))
                ))
                data = this.props.valueHistory.values.oneWeek.map(val => (
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
                data = this.props.valueHistory.values.oneYear.slice(
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
                data = this.props.valueHistory.values.oneYear.slice(
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
                data = this.props.valueHistory.values.oneYear.map(val => (
                    val / 100
                ));
                break;
            default:
                break;
        }
        while (this.lineChart.data.datasets[0].data.length > 0) {
            this.lineChart.data.datasets[0].data.pop();
        }
        while (this.lineChart.data.labels.length > 0) {
            this.lineChart.data.labels.pop();
        }
        for(let i = 0; i < data.length; i++) {
            this.lineChart.data.datasets[0].data.push(data[i])
        }
        for (let i = 0; i < labels.length; i++) {
            this.lineChart.data.labels.push(labels[i])
        }
        this.lineChart.data.datasets[0].borderColor = (this.delta < 0 ? "rgba(255,80,0,1)" : "rgba(0,200,5,1)");
        this.lineChart.update();
    }

    render() {
        return (
            <>
                <header className="account-summary-header">
                    <h1>{formatToDollar(this.state.display || this.props.portfolioVal)}</h1>
                    <div className="account-summary-header-subinfo">
                        <p>{this.calcChange()} <span className="graph-view">{this.graphView()}</span></p>
                    </div>
                </header>
                <canvas id="myChart" onMouseEnter={this.hideGraphView} onMouseLeave={this.resetHeader}></canvas>
            </>
        )
    }
}

export default connect(mapStateToProps, null)(AccountSummaryHeader);