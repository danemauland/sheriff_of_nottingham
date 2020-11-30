import React from "react";

export default props => (
    <span className="stock-item">
        <h4>{props.item[0]}</h4>
        <p>{props.item[1]}</p>
    </span>
)