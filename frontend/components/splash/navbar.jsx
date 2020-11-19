import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./nav_links";

export default () => (
    <nav className="splash-nav" onClick={e => e.stopPropagation()}>
        <div className="splash-nav-div">
            <NavLinks />
            <div className="nav-session-auth-links" >
                <Link className="nav-login" to="/login">Log In</Link>
                <div className="nav-auth-spacer"></div>
                <Link className="nav-signup rounded-button" to="/signup">Sign Up</Link>
            </div>
        </div>
    </nav>    
)