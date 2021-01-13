import React from "react";

export default ({color, type}) => (
    <option value={type} className={`${color}-background-selected`}>
        {type}
    </option>
);