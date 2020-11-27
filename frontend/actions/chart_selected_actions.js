export const UPDATE_CHART = "UPDATE_CHART";
export const CHART_UPDATED = "CHART_UPDATED";

export const updateChart = chartType => ({
    type: UPDATE_CHART,
    chartType,
});

export const chartUpdated = () => ({
    type: CHART_UPDATED,
});
