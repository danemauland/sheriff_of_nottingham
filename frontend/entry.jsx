// TODO
// PRIORITY
// other summary info for stock, e.g. about. optional show more/less for now
// stock trade menu
// autofill stock trade menu from clicking graph
// stock positions on dashboard
// newsfeed on dashboard
// Change free stocks to random stocks


// remove event handlers when component unmounts
// ADD SEPARATE SIGNUP PAGE
// Add in messages/trade confirms
// history
// reflect changes in cash balance outside market hours for the day
//toggle to sandbox api key
// error handler for APIs

import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store";
import Root from "./components/root";
import { finnhubQ, alphaQ, polygonQ} from "./actions/external_api_actions";

// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
import {login} from "./actions/session_actions";
import { fetchCandles, fetchQuote, fetchCompanyOverview } from "./actions/external_api_actions";
const finnhub = require('finnhub');
import {postCashTransaction} from "./util/cash_transactions_api_util";
// END TESTING

Date.prototype.stdTimezoneOffset = function () {
    const jan = new Date(this.getFullYear(), 0, 1);
    const jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDSTObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    let store;
    if (window.currentUser) {
        const preloadedState = {
            session: {
                username: window.currentUser.username,
            },
            entities: {
                cashTransactions: [...window.currentUser.cashTransactions],
                trades: [...window.currentUser.trades],
            }
        }
        store = configureStore(preloadedState);
        delete window.currentUser;
    } else { store = configureStore() }
    
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