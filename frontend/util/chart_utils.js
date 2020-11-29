import {
    formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
} from "../util/dashboard_calcs";

const PREMARKET_TIMESLOTS = 6;
const MARKET_HOURS_TIMESLOTS = 79;
const TOTAL_ONE_DAY_TIMESLOTS = 109;
const ONE_MONTH_OFFSET = 31;
const THREE_MONTH_OFFSET = 91;

Chart.Tooltip.positioners.custom = (elements, position) => {
    if (elements.length === 0) return false;
    return {
        x: position.x,
        y: 9,
    }
}

export const getPreviousEndingValue = function(oneYearValues, type) {
    switch (type) {
        case ONE_DAY:
            return oneYearValues[oneYearValues.length - 2];
        case ONE_WEEK:
            return oneYearValues[oneYearValues.length - 8];
        case ONE_MONTH:
            return oneYearValues[oneYearValues.length - ONE_MONTH_OFFSET];
        case THREE_MONTH:
            return oneYearValues[oneYearValues.length - THREE_MONTH_OFFSET];
        case ONE_YEAR:
            return oneYearValues[0];
        default:
            break;
    }
}

export const getStrChange = function(startVal, currentVal) {
    let strChange = "";
    let percentage;
    let delta = currentVal - startVal;
    let sign = (delta < 0 ? "-" : "+");
    delta = Math.abs(delta);
    percentage = (startVal === 0 ? 0 : delta / startVal);
    percentage = (percentage * 100).toFixed(2);
    strChange += sign;
    strChange += formatToDollar(delta);
    strChange += ` (${sign}${percentage}%)`;
    return strChange;
}

export const getTimesArray = function(times, type) {
    let newTimes;
    const yearLength = times.oneYear.length;
    switch (type) {
        case ONE_DAY:
            newTimes = [];
            let startTime = times.oneDay[0];
            for (let i = PREMARKET_TIMESLOTS; i > 0; i--) {
                newTimes.push(startTime - (5 * 60 * i))
            }
            newTimes = newTimes.concat(times.oneDay)
            while (newTimes.length < TOTAL_ONE_DAY_TIMESLOTS) {
                const newTime = newTimes[newTimes.length - 1] + (5 * 60)
                newTimes.push(newTime)
            }
            break;
        case ONE_WEEK:
            newTimes = times.oneWeek
            break;
        case ONE_MONTH:
            newTimes = times.oneYear.slice(yearLength - ONE_MONTH_OFFSET, yearLength)
            break;
        case THREE_MONTH:
            newTimes = times.oneYear.slice(yearLength - THREE_MONTH_OFFSET, yearLength)
            break;
        case ONE_YEAR:
            newTimes = times.oneYear;
            break;
        default:
            break;
    }
    return newTimes;
}

const formatTime = function(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = (hours > 11 ? "PM" : "AM")
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours > 12) hours = hours % 12;
    return `${hours}:${minutes} ${ampm}`
}

const parseMonth = function(date) {
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

const formatDateTime = function (date, includeTime = true) {
    const month = parseMonth(date);
    const day = date.getDate();
    if (includeTime) return `${month} ${day}, ${formatTime(date)}`;
    else return `${month} ${day}`
}

export const getLabelsArray = function(times, type) {
    let labels;
    switch (type) {
        case ONE_DAY:
            labels = times.map(time => (
                formatTime(new Date(time * 1000))
            ))
            break;
        case ONE_WEEK:
            labels = times.map(time => (
                formatDateTime(new Date(time * 1000))
            ))
            break;
        case ONE_MONTH:
            labels = times.map(time => (
                formatDateTime(new Date(time * 1000), false)
            ))
            break;
        case THREE_MONTH:
            labels = times.map(time => (
                formatDateTime(new Date(time * 1000), false)
            ))
            break;
        case ONE_YEAR:
            labels = times.map(time => (
                formatDateTime(new Date(time * 1000), false)
            ))
            break;
        default:
            break;
    }
    return labels;
}

export const getDatasets = function(values, type) {
    const newValues = [ [], [], [], [], ];

    let [
        inMarketHoursVals,
        outMarketHoursVals,
        inMarketHoursPastVals,
        outMarketHoursPastVals,
    ] = newValues;

    switch (type) {
        case ONE_DAY:
            for (let i = 0; i < PREMARKET_TIMESLOTS; i++) {
                outMarketHoursVals.push(values.oneDay[0] / 100);
                inMarketHoursVals.push(undefined);
            }
            values.oneDay.forEach(val => {
                outMarketHoursVals.push(undefined);
                inMarketHoursVals.push(val / 100);
            });
            outMarketHoursVals.pop()
            outMarketHoursVals[PREMARKET_TIMESLOTS] = values.oneDay[0] / 100;
            if (inMarketHoursVals.length === 
                PREMARKET_TIMESLOTS + MARKET_HOURS_TIMESLOTS
            ) {
                for (
                    let i = PREMARKET_TIMESLOTS + MARKET_HOURS_TIMESLOTS - 1;
                    i < TOTAL_ONE_DAY_TIMESLOTS; 
                    i++
                ){
                    if (times[i] < new Date().getTime() / 1000) {
                        outMarketHoursVals.push(inMarketHoursVals.last)
                    }
                }
            }
            const pastVal = values.oneYear[values.oneYear.length - 2] / 100;
            for (let i = 0; i < TOTAL_ONE_DAY_TIMESLOTS; i++) {
                if (
                    i > PREMARKET_TIMESLOTS &&
                    i < PREMARKET_TIMESLOTS + MARKET_HOURS_TIMESLOTS
                ) {
                    inMarketHoursPastVals.push(pastVal)
                    outMarketHoursPastVals.push(undefined)
                } else {
                    inMarketHoursPastVals.push(undefined)
                    outMarketHoursPastVals.push(pastVal)
                }
            }
            break;
        case ONE_WEEK:
            values.oneWeek.forEach(val => inMarketHoursVals.push(val / 100));
            break;
        case ONE_MONTH:
            values.oneYear.slice(
                values.oneYear.length - ONE_MONTH_OFFSET,
                values.oneYear.length
            ).forEach(val => inMarketHoursVals.push(val / 100));
            break;
        case THREE_MONTH:
            values.oneYear.slice(
                values.oneYear.length - THREE_MONTH_OFFSET,
                values.oneYear.length
            ).forEach(val => inMarketHoursVals.push(val / 100));
            break;
        case ONE_YEAR:
            values.oneYear.forEach(val => inMarketHoursVals.push(val / 100));
            break;
        default:
            break;
    }
    return newValues;
}

const generateCustomTooltip = function(boundSetState) {
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
            boundSetState({
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

export const chartOptions = function(valueIncreased, boundSetState) {
    return {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    borderColor: (valueIncreased ? "rgba(0,200,5,1)" : "rgba(255,80,0,1)"),
                    backgroundColor: "transparent",
                    borderWidth: 2,
                },
                {
                    data: [],
                    borderColor: (valueIncreased ? "rgba(0,200,5,0.5)" : "rgba(255,80,0,0.5)"),
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
                custom: generateCustomTooltip(boundSetState),
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
    }
}

export const graphView = function(type) {
    switch (type) {
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