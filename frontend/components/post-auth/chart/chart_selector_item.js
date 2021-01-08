import React from "react";

export default ({classNames, viewName, chartChanger}) => (
    <a className={classNames} onClick={chartChanger}>
        <div className="chart-selector-link-text">
            {viewName}
        </div>
    </a>
)