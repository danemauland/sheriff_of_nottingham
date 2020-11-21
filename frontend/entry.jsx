import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store"
import Root from "./components/root"

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