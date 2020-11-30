export const SET_API_DEBOUNCE_START_TIME = "SET_API_DEBOUNCE_START_TIME";
export const REMOVE_API_DEBOUNCE_START_TIME = "REMOVE_API_DEBOUNCE_START_TIME";

export const setAPIDebounceStartTime = (startTime) => ({
    type: SET_API_DEBOUNCE_START_TIME,
    startTime,
})

export const removeAPIDebounceStartTime = () => ({
    type: REMOVE_API_DEBOUNCE_START_TIME,
})