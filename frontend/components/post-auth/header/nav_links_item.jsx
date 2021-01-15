import React from "react";
import {Link} from "react-router-dom";

export default ({name, clickHandler, divClass, classNames, child}) => {
    return (
        <li>
            <div className={divClass}>
                <Link to="/" className={classNames} onClick={clickHandler}>
                    {name}
                </Link>
                {child}
            </div>
        </li>  
    )
}