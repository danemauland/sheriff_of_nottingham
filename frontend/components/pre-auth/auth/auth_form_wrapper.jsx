import React from "react";
import AuthForm from "./auth_form";

export default props => (
    <div className="auth-section">
        <div className="auth-image-div">
        </div>
        <div className="auth-form-div">
            <div className="inner-auth-form-div">
                <AuthForm {...props} />
            </div>
        </div>
    </div>
)

