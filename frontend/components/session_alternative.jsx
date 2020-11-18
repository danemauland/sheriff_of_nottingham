import React from "react";
import { Link } from "react-router-dom";

export default ({formType}) => (
    <Link to={formType === "Sign In" ? "/signup" : "/login"}>
        { formType === "Sign In" ? "Need an account? Sign up instead." :
        "Already have an account? Sign in instead."}
    </Link>
)