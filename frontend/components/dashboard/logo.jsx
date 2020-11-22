import React from "react";
import { GiPoliceBadge } from "react-icons/gi";
import {Link} from "react-router-dom";

export default () => (
    <Link to="/dashboard" className="dashboard-logo-link">
        <GiPoliceBadge />
    </Link>
)