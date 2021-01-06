import React from "react";
export default ({title}) => {
    let target = "_self";
    let className = "dark-green-hover";
    let href = "#";
    switch (title) {
        case "Crypto":
            className = "crypto-li";
            break;

        case "LinkedIn":
            target = "_blank";
            href = "https://www.linkedin.com/in/danemauland/";
            break;

        case "Github":
            target = "_blank";
            href = "https://github.com/danemauland";
            break;
    }

        return (
            <li className={className}>
                <a target={target} href={href}>
                    {title}
                </a>
            </li>
        )
}