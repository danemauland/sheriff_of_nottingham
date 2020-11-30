import {RECEIVE_MARKET_NEWS,} from "../actions/external_api_actions";

const defaultState = [];
export default (state = defaultState, action) => {
    switch (action.type) {
        case RECEIVE_MARKET_NEWS:
            return action.marketNews;
        default:
            return state;
    }
}