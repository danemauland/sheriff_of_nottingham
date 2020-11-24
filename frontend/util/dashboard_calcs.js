export const formatToDollar = num => {
    if ((typeof num) !== "number") return false;
    num = (num / 100).toLocaleString();
    if (num[num.length - 2] === ".") {num += "0"}
    else if (num[num.length - 3] !== ".") {num += ".00"};
    return "$" + num;
}

export const ONE_DAY = "ONE_DAY";
export const ONE_WEEK = "ONE_WEEK";
export const ONE_MONTH = "ONE_MONTH";
export const THREE_MONTH = "THREE_MONTH";
export const ONE_YEAR = "ONE_YEAR";