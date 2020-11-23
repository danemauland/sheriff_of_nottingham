export const calcPosVal = displayedAssets => {
    let totVal = 0;
    Object.values(displayedAssets).forEach(asset => {
        let numShares;
        let price;
        if (asset.ownershipHistory) {
            numShares = asset.ownershipHistory.numShares[
                asset.ownershipHistory.numShares.length - 1
            ]
        }
        if (asset.prices && asset.prices.oneDay) {
            price = asset.prices.oneDay[asset.prices.oneDay.length - 1]
        }
        if (price && numShares) { 
            totVal += (price * numShares)
        }
    })
    return totVal;
}

export const calcPortfolioVal = (displayedAssets, cashBal) => {
    return (
    calcPosVal(displayedAssets) + cashBal
)}

export const formatToDollar = num => {
    if ((typeof num) !== "number") return false;
    num = (num / 100).toLocaleString();
    if (num[num.length - 2] === ".") {num += "0"}
    else if (num[num.length - 3] !== ".") {num += ".00"};
    return "$" + num;
}