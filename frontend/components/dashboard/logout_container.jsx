import {connect} from "react-redux";
import Logout from "./logout";
import {logout} from "../../actions/session_actions";

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
})

export default connect(null, mapDispatchToProps)(Logout)