import * as tradeAPIUtils from "../util/trade_utils";

export const RECEIVE_TRADE = "RECEIVE_TRADE";
export const DEMOLISH_TRADES = "DEMOLISH_TRADES";

const receiveTrade = trade => ({
    type: RECEIVE_TRADE,
    trade,
})

const demolishTrades = () => ({
    type: DEMOLISH_TRADES,
})

export const deleteAllTrades = () => dispatch => {
    tradeAPIUtils.demolishTrades.then(
        () => dispatch(demolishTrades()),
        error => console.log(error)
    )
}

export const createTrade = trade => dispatch => {
    tradeAPIUtils.createTrade(trade).then(
        trade => dispatch(receiveTrade(trade)),
        error => console.log(error),
    )
}