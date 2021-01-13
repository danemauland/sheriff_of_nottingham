import React from "react";

const HeaderDropdownItem = ({name, icon, onClick}) => (
    <a onClick={onClick} className="account-dropdown-item">
        <div className="account-dropdown-item-container">
            {icon} {name}
        </div>
    </a>
)

export default HeaderDropdownItem;