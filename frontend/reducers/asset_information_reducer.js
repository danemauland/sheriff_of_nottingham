const defaultState = {
    assetInformation: new Set(),
};
export default (state = defaultState, action) => {
    Object.freeze(state)
    let newState;
    switch (action.type) {
        default:
            return state;
    }
}