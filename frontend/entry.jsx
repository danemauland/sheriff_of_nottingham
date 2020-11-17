import React from "react";
import ReactDOM from "react-dom";

// TESTING
import * as sessionAPIUtil from "./util/session_api_util";
// END TESTING

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    ReactDOM.render(<h1>Test</h1>, root);

    //TESTING
    window.$ = $;
    window.signup = sessionAPIUtil.signup; 
    window.login = sessionAPIUtil.login;
    window.logout = sessionAPIUtil.logout;
    //END TESTING
});