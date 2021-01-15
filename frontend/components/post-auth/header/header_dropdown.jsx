import React from "react";
import HeaderDropdownHeader from "./header_dropdown_header";
import HeaderDropdownNav from "./header_dropdown_nav";

const HeaderDropdown = () => (
    <div className="account-dropdown hidden" onClick={e => e.stopPropagation()}>
        <HeaderDropdownHeader />
        <HeaderDropdownNav />
    </div>
);

export default HeaderDropdown;