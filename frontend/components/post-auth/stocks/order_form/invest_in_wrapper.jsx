import React from "react";

export default ({children}) => (
    <div>
        <span>Invest In</span>
        
        <div className="invest-in-select-wrapper">
            <div className="invest-in-select shadow-hover">
                {children}
            </div>
        </div>
    </div>
)