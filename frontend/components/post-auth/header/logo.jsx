import React from "react";
import { GiPoliceBadge } from "react-icons/gi";
import {Link} from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return ({
        valueIncreased: state.ui.valueIncreased,
    })
}


const Logo = props => (
    <Link to="/dashboard" className={"dashboard-logo-link " + (props.valueIncreased ? "dark-green-hover" : "red-hover")}>
        <GiPoliceBadge />
    </Link>
)

export default connect(mapStateToProps, null)(Logo)