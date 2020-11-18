import {connect} from "react-redux";
import AuthForm from "./auth_form";
import {signup, createDemo} from "../actions/session_actions";

const mapStateToProps = state => ({
    user: {
        username: "",
        password: "",
    },
    formType: "Sign Up",
    errors: state.errors.session,
})

const mapDispatchToProps = dispatch => ({
    action: user => dispatch(signup(user)),
    createDemo: () => dispatch(createDemo())
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)