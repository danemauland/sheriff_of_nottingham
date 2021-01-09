import React from "react";

export default ({toggle, className, toggleType, desc}) => (
    <div className="stock-description-positioner">
        <span>
            {desc}
            <button onClick={toggle} className={className}>
                {`Read ${toggleType}`}
            </button>
        </span>
    </div>
)