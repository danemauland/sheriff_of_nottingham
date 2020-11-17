import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store"
import Root from "./components/root"

// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
// END TESTING

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    const store = configureStore();
    const preloadedState;
    if (window.currentUser) {
        preloadedState = {
            session: {
                username: window.currentUser.username,
            }
        }
    }
    ReactDOM.render(<Root store={store} />, root);

    //TESTING
    window.$ = $;
    window.getState = store.getState;
    window.dispatch = store.dispatch;
    window.login = sessionAPIUtil.login;
    //END TESTING
});