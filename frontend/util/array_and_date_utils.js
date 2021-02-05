import {parseMonth} from "./dashboard_calcs";

Date.prototype.stdTimezoneOffset = function () {
    const jan = new Date(this.getFullYear(), 0, 1);
    const jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDSTObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

Date.prototype.adjustForDST = () => {
    if (new Date().isDSTObserved()) {
        this.setUTCHours(this.getUTCHours() - 1)
    }
    return this;
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

Array.convert = function(input) {
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return [input]; 
    if (!Array.isArray(input)) return Array.from(input);
}

Set.convert = function(input) {
    if (input instanceof Set) return input;
    return new Set(Array.convert(input));
}

export const formatDate = datetime => {
    const date = new Date(datetime * 1000);
    const month = parseMonth(date);
    const casedMonth = month[0] + month.slice(1).toLowerCase();
    return casedMonth + " " + date.getDate();
}

export default () => {}