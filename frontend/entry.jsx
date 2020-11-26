// TODO
// remove event handlers when component unmounts
// ADD SEPARATE SIGNUP PAGE
// Change free stocks to random stocks
// Clicking cash expands buying power to show cash bal options
// loading screen
// Add in messages/trade confirms
// history
// search dropdown
// reflect changes in cash balance outside market hours for the day
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store";
import Root from "./components/root";

// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
import {login} from "./actions/session_actions";
import { fetchCandles, fetchQuote } from "./actions/external_api_actions";
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
    
    ReactDOM.render(<Root store={store} />, root);

    //TESTING
    window.$ = $;
    window.getState = store.getState;
    window.dispatch = store.dispatch;
    window.APILogin = sessionAPIUtil.login;
    window.login = login;
    window.fetchCandles = fetchCandles;
    window.fetchQuote = fetchQuote;
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = window.finnhubAPIKey;
    window.finnhubClient = new finnhub.DefaultApi();
    window.postCashTransaction = postCashTransaction;
    //END TESTING
});