export const calcPosVal = displayedAssets => {
    let totVal = 0;
    Object.values(displayedAssets).forEach(asset => {
        if (asset.ownershipHistory
            && asset.ownershipHistory.numShares[asset.ownershipHistory.numShares.length - 1]
            && asset.currentPrice !== undefined) { 
            totVal += (asset.ownershipHistory.numShares[asset.ownershipHistory.numShares.length - 1]
                * asset.currentPrice)
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