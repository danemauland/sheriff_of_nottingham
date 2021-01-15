import React from "react";
import Splash from "./splash/splash";
import SignupFormContainer from "./auth/signup_form_container";
import LoginFormContainer from "./auth/login_form_container";
import { Route, Switch, Redirect } from "react-router-dom";

export default () => (
    <Switch>
        <Route exact path ="/" component={Splash} />
        <Route exact path ="/signup" component={SignupFormContainer} />
        <Route exact path="/login" component={LoginFormContainer} />
        <Route>
            <Redirect to="/" />
        </Route>
    </Switch>
);