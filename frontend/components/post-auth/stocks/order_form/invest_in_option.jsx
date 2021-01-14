import React from "react";

export default ({type, classNames, handleSelect}) => (
    <option value={type} className={classNames} onClick={handleSelect}>
        {type}
    </option>
);