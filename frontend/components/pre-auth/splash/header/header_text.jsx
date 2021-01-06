import React from "react";
import { Link } from "react-router-dom";
let pText = "Nottingham, a pioneer of commission-free investing, gives you ";
pText += "more ways to make your money work harder.";

export default () => (
    <div className="splash-header-text-div">
        <div className="splash-header-text-wrapper">
            <h1>Investing for Everyone</h1>
            <p>{pText}</p>
            <div className="header-button-div">
                <Link className="header-signup rounded-button" to="/signup">
                    Sign Up
                </Link>    
            </div>                        
        </div>
    </div>
)