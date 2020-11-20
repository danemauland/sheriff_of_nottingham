import React from "react";
import Splash from "./splash/splash";
import SignupFormContainer from "./signup_form_container"
import LoginFormContainer from "./login_form_container"
import Dashboard from "./dashboard/dashboard"
import {AuthRoute, ProtectedRoute} from "../util/route_util"
import Modal from "./modal.jsx"

export default props => (
    <>
        <Modal />
        <AuthRoute exact path="/" component={Splash} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
    </>
)