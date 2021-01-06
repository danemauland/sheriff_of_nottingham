import React from "react";
import Splash from "./pre-auth/splash/splash";
import SignupFormContainer from "./pre-auth/auth/signup_form_container";
import LoginFormContainer from "./pre-auth/auth/login_form_container";
import Dashboard from "./dashboard/dashboard";
import Initialize from "./initialize";
import { Route } from "react-router-dom";
import {AuthRoute, ProtectedRoute} from "../util/route_util";
import Modal from "./modal.jsx";

export default () => (
    <>
        <Modal />
        <Route path="/" component={Initialize} />
        <AuthRoute exact path="/" component={Splash} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
    </>
)