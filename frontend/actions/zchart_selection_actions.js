export const FLUSH_CHART_SELECTION = "FLUSH_CHART_SELECTION";
export const UPDATE_CHART_SELECTION = "UPDATE_CHART_SELECTION";

export const flushChartSelection = () => ({
    type: FLUSH_CHART_SELECTION
})

export const updateChartSelection = (price, createdAt) => ({
    type: UPDATE_CHART_SELECTION,
    price,
    createdAt,
})