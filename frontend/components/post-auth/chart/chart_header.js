import React from "react";

export default ({title, view, change}) => (
    <header className="chart-header">
        <h1 className="post-auth-title">
            {title}
        </h1>

        <div className="chart-header-subinfo">
            <p>
                {change}
                
                <span className="graph-view">
                    {" " + view}
                </span>
            </p>
        </div>
    </header>
)