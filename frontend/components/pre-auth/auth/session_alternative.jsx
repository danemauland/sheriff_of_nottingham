import React from "react";
import { Link } from "react-router-dom";

export default ({isSignUp}) => (
    <p>
        <Link to={isSignUp ? "/login" : "/signup"}>
            {
                isSignUp ? 
                    "Already have an account? Sign in instead."
                :
                    "Need an account? Sign up instead."
            }
        </Link>
    </p>
)