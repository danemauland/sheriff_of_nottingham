import React from "react";
import { GiPoliceBadge } from "react-icons/gi";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import {
    getValueIncreased,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = state => ({
    color: getValueIncreased(state) ? "dark-green" : "red"
});

const Logo = ({color}) => (
    <Link to="/dashboard" className={`dashboard-logo-link ${color}-hover`}>
        <GiPoliceBadge />
    </Link>
)

export default connect(mapStateToProps, null)(Logo)