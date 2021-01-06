import React from "react";
import {FiAlertCircle} from "react-icons/fi";
export default ({errors}) => (
    <ul className="session-errors">
        {errors.map((error, i) => (
            <li key={i}><FiAlertCircle /> {error}</li>
        ))}
    </ul>
)