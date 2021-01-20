import {
    formatToDollar,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTH,
    ONE_YEAR,
    THREE_MONTH_OFFSET,
    ONE_MONTH_OFFSET,
    formatPercentage,
    getPreviousEndingValue,
    camelCase,
} from "../util/dashboard_calcs";

export const GRAPH_VIEWS = [ONE_DAY,ONE_WEEK,ONE_MONTH,THREE_MONTH,ONE_YEAR];

Chart.defaults.global.animation.duration = 0;

Chart.Tooltip.positioners.custom = (elements, position) => {
    if (elements.length === 0) return false;

    return {
        x: position.x,
        y: 9,
    };
};

export const getStrChange = function(startVal, currentVal) {
    let delta = currentVal - startVal;
    
    const percentage = (startVal === 0 ? 0 : delta / startVal);

    const sign = (delta < 0 ? "-" : "+");
    
    delta = Math.abs(delta);
    
    return `${sign}${formatToDollar(delta)} (${formatPercentage(percentage)})`;
}

const formatTime = function(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = (hours > 11 ? "PM" : "AM")

    if (minutes < 10) minutes = `0${minutes}`;
    if (hours > 12) hours = hours % 12;

    return `${hours}:${minutes} ${ampm}`
}

const MONTHS = [
    "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"
];

export const parseMonth = date => MONTHS[date.getMonth()];

const formatDateTime = function (date, toggleYear) {
    const month = parseMonth(date);
    const day = date.getDate();

    if (toggleYear) return `${month} ${day}, ${date.getFullYear()}`;
    return `${month} ${day}, ${formatTime(date)}`;
}

const getLabelsArray = function(times, type) {
    const dates = times.map(time => new Date(time * 1000));
    switch (type) {
        case ONE_DAY:
                const labels = dates.map(date => formatTime(date));
                while (labels.length < 79) labels.push(undefined);
            return labels;
            
        case ONE_WEEK:
            return dates.map(date => formatDateTime(date));
            
        case ONE_MONTH:
            return dates.map(date => formatDateTime(date));
            
        case THREE_MONTH:
            return dates.map(date => formatDateTime(date, true));
            
        case ONE_YEAR:
            return dates.map(date => formatDateTime(date, true));
    }
}

const getDatasets = function(values, type, times) {
    let vals = [];
    let prevDayCloseArray = [];

    switch (type) {
        case ONE_DAY:
            vals = values.oneDay;
            const prevClose = values.oneYear[values.oneYear.length - 2] / 100;
            prevDayCloseArray = new Array(79).fill(prevClose);
            while (times.length < prevDayCloseArray.length) {
                times.push(times.last() + 5 * 60);
            }
            break;

        case ONE_WEEK:
            vals = values.oneWeek;
            break;

        case ONE_MONTH:
            vals = values.oneMonth;
            break;

        case THREE_MONTH:
            vals = values.threeMonth;
            break;

        case ONE_YEAR:
            vals = values.oneYear;
            break;
    }
    return [vals.map(val => val / 100), prevDayCloseArray, times];
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
                displayVal: Math.floor(tooltipModel.dataPoints[0].yLabel * 100),
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
        tooltipEl.style.top = position.top - 20 + $(window).scrollTop() + 'px';
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
                    pointRadius: 0,
                    pointHoverRadius: 0,
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
                    return tooltipItem.datasetIndex === 0;
                }
            },
            hover: {
                mode: "index",
                intersect: false,
            }
        }
    }
}

export const formatGraphView = function(type) {
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

const resetChartLabels = labels => {
    while (labels.length > 0) {
        labels.pop();
    }
}

const resetChartDatasets = datasets => {
    datasets.forEach(set => {
        while (set.data.length > 0) {
            set.data.pop()
        }
    })
}

const resetChartData = ({labels, datasets}) => {
    resetChartLabels(labels);
    resetChartDatasets(datasets);
}

const fillChartLabels = (labels, newLabels) => {
    for (let i = 0; i < newLabels.length; i++) {
        labels.push(newLabels[i])
    }
}

const fillChartDataSets = (datasets, newDatasets) => {
    newDatasets.forEach((dataset, i) => {
        dataset.forEach(data => datasets[i].data.push(data))
    })
}

const fillChartData = ({labels, datasets}, newLabels, newDatasets) =>{
    fillChartLabels(labels, newLabels);
    fillChartDataSets(datasets, newDatasets)
}

const updateScale = (chart, newDatasets) => {
    // removes the hidden times array from datasets
    newDatasets.pop();

    const flat = newDatasets.flat().filter(ele => ele !== undefined);

    let max = Math.max(...flat);
    let min = Math.min(...flat);

    const delta = max - min;

    max = max + delta * 0.01;
    min = min - delta * 0.01;

    const ticks = chart.options.scales.yAxes[0].ticks;
    ticks.max = max;
    ticks.min = min;
};

export const refreshChartData = (chart, times, values, chartSelected)=>{
    const data = chart.data;

    resetChartData(data);

    const newTimes = [...times[camelCase(chartSelected)]];
    const newLabels = getLabelsArray(newTimes, chartSelected);
    const newDatasets = getDatasets(values, chartSelected, newTimes);
    debugger;
    fillChartData(data, newLabels, newDatasets);
    updateScale(chart.chart, newDatasets);
    chart.update();
};

export const removeToolTip = () => {
    $("#chartjs-tooltip").remove();
};

export const updateLineColor = (chart, valInc) => {
    const datasets = chart.data.datasets;

    datasets[0].borderColor = valInc ? "rgba(0,200,5,1)" : "rgba(255,80,0,1)";
    
    chart.update();
}

export const chartSelectorClassNamesGenerator = (valInc, selectedView) => {
    const color = valInc ? "dark-green" : "red";

    const classNames = `chart-selector-link ${color}-hover `;

    return view => {
        const isNotSelected = view !== selectedView;

        if (isNotSelected) return classNames;

        return `${classNames}chart-selector-link-selected-${color} `;
    }
}

export const getViewName = view => {
    switch (view) {
        case ONE_DAY: return "1D";
        case ONE_WEEK: return "1W";
        case ONE_MONTH: return "1M";
        case THREE_MONTH: return "3M";
        case ONE_YEAR: return "1Y";
    }
}

export const calcStrChange = (
    {values, startingCashTime, startingCashBal},
    {chartSelected, displayVal, dataPointIndex},
    timesDataset,
) => {
    let startVal = getPreviousEndingValue(values.oneYear, chartSelected);
    let endVal = displayVal;

    if (startVal === 0) {
        const chartStartTime = timesDataset.data[dataPointIndex];
        const cashStartsBeforeChart = startingCashTime < chartStartTime;

        if (this.chartIsHovered() || cashStartsBeforeChart) {
            startVal = startingCashBal;
        } else endVal = 0;
    }

    return getStrChange(startVal, endVal);
}