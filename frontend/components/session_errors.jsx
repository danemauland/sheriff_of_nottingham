import React from "react";

export default ({errors}) => (
    <ul>
        {errors.map((error, i) => (
            <li key={i}>{error}</li>
        ))}
    </ul>
)