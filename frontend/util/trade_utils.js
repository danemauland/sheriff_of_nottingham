export const createTrade = trade => (
    $.ajax({
        url: `/api/trades`,
        method: "POST",
        data: {trade},
    })
);

export const demolishTrades = () => (
    $.ajax({
        url: `/api/trades`,
        method: "DELETE",
    })
);