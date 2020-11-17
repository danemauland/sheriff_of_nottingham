import React from "react";
import {Route, withRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";

const auth = ({component: Component, path, loggedIn, exact}) => (
    <Route path={path} exact={exact} render={props =>
            !loggedIn ? <Component {...props} /> : <Redirect to="/dashboard" />
        }
    />
);

const mapStateToProps = state => ({
    loggedIn: !!state.session.username,
});

export const AuthRoute = withRouter(
    connect(mapStateToProps, null)(auth)
);

const prot = ({component: Component, path, loggedIn, exact}) => (
    <Route path={path} exact={exact} render={props =>
            loggedIn ? <Component {...props} /> : <Redirect to="/" />
        }
    />
);

export const ProtectedRoute = withRouter(
    connect(mapStateToProps, null)(prot)
);