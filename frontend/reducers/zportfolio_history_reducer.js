const defaultState = {
    cashTransactions: [],
    cashHistory: [[],[]],
    trades: [],
};
export default (state = defaultState, action) => {
    Object.freeze(state)
    switch (action.type) {
        default:
            return state;
    }
}