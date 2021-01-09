import React from "react";

export default ({item: [title, val]}) => (
    <span className="stock-item">
        <h4>{title}</h4>
        <p>{val}</p>
    </span>
)