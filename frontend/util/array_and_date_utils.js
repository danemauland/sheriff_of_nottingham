import {parseMonth} from "./chart_utils";

Date.prototype.stdTimezoneOffset = function () {
    const jan = new Date(this.getFullYear(), 0, 1);
    const jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDSTObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

export const formatDate = datetime => {
    const date = new Date(datetime * 1000);
    const month = parseMonth(date);
    const casedMonth = month[0] + month.slice(1).toLowerCase();
    return casedMonth + " " + date.getDate();
}

export default () => {}