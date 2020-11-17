import { RECEIVE_CURRENT_USER } from "./session_actions";

export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';

export const receiveErrors = (errors) => ({
    type: RECEIVE_CURRENT_USER,
    errors
})