// valueIncreased actions
export const UPDATE_VALUE_INCREASED = "UPDATE_VALUE_INCREASED";

export const updateValueIncreased = bool => ({
    type: UPDATE_VALUE_INCREASED,
    bool,
});

// modal actions
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";

export const openModal = modal => ({
    type: OPEN_MODAL,
    modal,
});

export const closeModal = () => ({
    type: CLOSE_MODAL,
});

// API Debounce actions
export const SET_API_DEBOUNCE_START_TIME = "SET_API_DEBOUNCE_START_TIME";
export const REMOVE_API_DEBOUNCE_START_TIME = "REMOVE_API_DEBOUNCE_START_TIME";

export const setAPIDebounceStartTime = startTime => ({
    type: SET_API_DEBOUNCE_START_TIME,
    startTime,
});

export const removeAPIDebounceStartTime = () => ({
    type: REMOVE_API_DEBOUNCE_START_TIME,
});