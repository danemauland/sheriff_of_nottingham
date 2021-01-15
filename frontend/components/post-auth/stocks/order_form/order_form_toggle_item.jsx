import React from "react";

export default ({type, ticker, handleClick, classNames}) => (
    <div className={classNames}>
        <button onClick={handleClick} value={type}>
            {type + " " + ticker}
        </button>
    </div>
)