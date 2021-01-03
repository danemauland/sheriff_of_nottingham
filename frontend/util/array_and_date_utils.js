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

export default () => {}