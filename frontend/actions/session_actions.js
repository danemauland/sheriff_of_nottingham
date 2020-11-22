import * as sessionAPIUtil from "../util/session_api_util";
import {receiveSessionErrors} from "./session_error_actions"

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

export const receiveCurrentUser = user => ({
    type: RECEIVE_CURRENT_USER,
    user,
})

const logoutCurrentUser = () => ({
    type: LOGOUT_CURRENT_USER,
})

export const login = user => dispatch => {
    sessionAPIUtil.login(user).then(
        user => dispatch(receiveCurrentUser(user)),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    )
}

export const logout = () => dispatch => {
    sessionAPIUtil.logout().then(
        () => dispatch(logoutCurrentUser()),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    )
}

export const signup = user => dispatch => {
    sessionAPIUtil.signup(user).then(
        user => dispatch(receiveCurrentUser(user)),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    )
}

export const createDemo = () => dispatch => {
    sessionAPIUtil.createDemo().then(
        user => dispatch(receiveCurrentUser(user)),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    )
}