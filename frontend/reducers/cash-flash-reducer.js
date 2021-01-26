import { 
    FLASH_CASH,
    CASH_FLASHED,
 } from "../actions/ui_actions";

const defaultState = false;
export default (state = defaultState, action) => {
    switch (action.type) {
        case FLASH_CASH:        
            return true;

        case CASH_FLASHED:        
            return false;

        default:
            return state;
    }
}