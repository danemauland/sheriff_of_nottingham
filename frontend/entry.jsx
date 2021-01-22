// TODO
// autofill stock trade menu from clicking graph
// Change free stocks to random stocks

// rework search to use alphavantage search
// rework purchasing power
// add errors to stock order form


// ADD SEPARATE SIGNUP PAGE
// Add in messages/trade confirms
// history
// reflect changes in cash balance outside market hours for the day
// error handler for APIs

import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store";
import Root from "./components/root";
import setArrayAndDateMethods from "./util/array_and_date_utils"; //don't delete, import needed to set up methods
import { finnhubQ, alphaQ, polygonQ} from "./actions/external_api_actions";


// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
import {login} from "./actions/session_actions";
import { fetchCandles, fetchQuote, fetchCompanyOverview} from "./actions/external_api_actions";
const finnhub = require('finnhub');
import {postCashTransaction} from "./util/cash_transactions_api_util";
// END TESTING

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    const store = configureStore(window.currentUser);
    if (window.currentUser) delete window.currentUser;
    
    finnhubQ.setDispatch(store.dispatch);
    alphaQ.setDispatch(store.dispatch);
    polygonQ.setDispatch(store.dispatch);
    ReactDOM.render(<Root store={store} />, root);

    //TESTING
    window.$ = $;
    window.getState = store.getState;
    window.dispatch = store.dispatch;
    window.APILogin = sessionAPIUtil.login;
    window.login = login;
    window.fetchCandles = fetchCandles;
    window.fetchQuote = fetchQuote;
    window.fetchCompanyOverview = fetchCompanyOverview;
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = window.finnhubAPIKey;
    window.finnhubClient = new finnhub.DefaultApi();
    window.postCashTransaction = postCashTransaction;
    //END TESTING
});