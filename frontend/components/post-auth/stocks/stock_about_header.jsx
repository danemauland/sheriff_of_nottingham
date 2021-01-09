import React from "react";

export default ({toggle, className, toggleType}) => (
    <header className="stock-about-header">
        <span>
            <h2>About</h2>
        </span>

        <span>
            <button onClick={toggle} className={className}>
                {`Show ${toggleType}`}
            </button>
        </span>
    </header>
)