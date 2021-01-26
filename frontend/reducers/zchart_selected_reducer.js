import {UPDATE_CHART} from "../actions/chart_selected_actions";
import {ONE_DAY} from "../util/dashboard_calcs";

const defaultState = ONE_DAY;
export default (state = defaultState, action) => {
    switch (action.type) {
        case UPDATE_CHART:
            return action.chartType;
        default:
            return state;
    }
}