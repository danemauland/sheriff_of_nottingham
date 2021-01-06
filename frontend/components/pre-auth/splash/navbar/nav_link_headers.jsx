import React from "react";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import NavLinkItem from "./nav_link_items";

export default ({clickHandler, title, items, selected}) => {
    return (
        <span>
            <button className="dark-green-hover" onClick={clickHandler}>
                {title} {selected ? <CgChevronUp /> : <CgChevronDown />}
            </button>
            <ul>
                {items.map((item, i) => <NavLinkItem key={i} title={item}/>)}
            </ul>
        </span>
    )
}