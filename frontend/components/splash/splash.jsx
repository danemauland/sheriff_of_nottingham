import React from "react";
import {Link} from "react-router-dom";

export default (props) => (
    <>
        <div>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    </>
)