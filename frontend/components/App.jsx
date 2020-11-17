import React from "react";
import Splash from "./splash/splash";
import {Route} from "react-router-dom";
import SignupFormContainer from "./signup_form_container"
import LoginFormContainer from "./login_form_container"

export default (props) => (
    <>
        <Route exact path="/" component={Splash} />
        <Route exact path="/signup" component={SignupFormContainer} />
        <Route exact path="/login" component={LoginFormContainer} />
    </>
)