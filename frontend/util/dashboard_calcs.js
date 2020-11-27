export const formatToDollar = (num, numDecimals = 2) => {
    if ((typeof num) !== "number") return false;
    let trail = Math.floor(num % 100).toString();
    if (trail.length < 2) trail += "0";
    num = (num / 100).toLocaleString();
    if (numDecimals === 2) {
        if (num[num.length - 2] === ".") {num += trail[1]}
        else if (num[num.length - 3] !== ".") {num += "." + trail};
    } else if (numDecimals === 1) {
        if (num[num.length - 3] === ".") {num = num.slice(0, -1)}
        else if (num[num.length - 2] !== ".") {num += "." + trail[0]}
    } else if (numDecimals === 0) {
        if (num[num.length - 3] === ".") {num = num.slice(0, -3)}
        else if (num[num.length - 2] === ".") {num = num.slice(0, -3)}
    } else if (numDecimals === -1) {
        if (num[num.length - 3] === ".") {num = num.slice(0, -3)}
        else if (num[num.length - 2] === ".") {num = num.slice(0, -3)};
        num += "."
    }
    return "$" + num;
}

export const ONE_DAY = "ONE_DAY";
export const ONE_WEEK = "ONE_WEEK";
export const ONE_MONTH = "ONE_MONTH";
export const THREE_MONTH = "THREE_MONTH";
export const ONE_YEAR = "ONE_YEAR";