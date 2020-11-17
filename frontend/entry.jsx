import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/store.js"

// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
// END TESTING

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    const store = configureStore();
    ReactDOM.render(<h1>Test</h1>, root);

    //TESTING
    window.$ = $;
    window.getState = store.getState;
    window.dispatch = store.dispatch;
    //END TESTING
});