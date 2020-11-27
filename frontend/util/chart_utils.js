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
const ONE_MONTH_OFFSET = 32;
const THREE_MONTH_OFFSET = 92;

export const getPreviousEndingValue = function(oneYearValues, type) {
    switch (type) {
        case ONE_DAY:
            return oneYearValues[oneYearValues.length - 3];
        case ONE_WEEK:
            return oneYearValues[oneYearValues.length - 9];
        case ONE_MONTH:
            return oneYearValues[oneYearValues.length - 32];
        case THREE_MONTH:
            return oneYearValues[oneYearValues.length - 92];
        case ONE_YEAR:
            return oneYearValues[0];
        default:
            break;
    }
}

export const getStrChange = function(startVal, currentVal) {
    let sign;
    let strChange = "";
    let percentage;
    let delta = currentVal - startVal;
    sign = (delta < 0 ? "-" : "+");
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