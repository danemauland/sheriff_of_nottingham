import {connect} from "react-redux";
import AuthForm from "./auth_form";
import {login} from "../actions/session_actions";
import { clearSessionErrors } from "../actions/session_error_actions";

const mapStateToProps = state => ({
    user: {
        username: "",
        password: "",
    },
    formType: "Sign In",
    errors: state.errors.session,
})

const mapDispatchToProps = dispatch => ({
    action: user => dispatch(login(user)),
    clearSessionErrors: () => dispatch(clearSessionErrors()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)