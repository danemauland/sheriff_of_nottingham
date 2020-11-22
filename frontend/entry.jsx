// TODO
// ADD MOBILE MENU ON SPLASH
// ADD BADGE SYMBOL TO LOGIN/SIGNUP TO ALLOW NAVIGATION BACK TO SPLASH
// add linkedig and github links
// remove event handlers when component unmounts
// ADD SEPARATE SIGNUP PAGE
// signin page image
// Clicking free stocks creates a pop up saying they're all free
// Clicking cash expands buying power to show cash bal options
// Add in messages/trade confirms
// tab header
// history
// search dropdown
// dynamic coloring based on increase/decrease in value
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store";
import Root from "./components/root";
import {receiveCurrentUser} from "./actions/session_actions";

// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
import {login} from "./actions/session_actions";
import { fetchCandles, fetchQuote } from "./actions/external_api_actions";
// END TESTING

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
    //END TESTING
});