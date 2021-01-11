import React from "react";
import HeaderDropdownHeader from "./header_dropdown_header";
import HeaderDropdownNav from "./header_dropdown_nav";

class HeaderDropdown extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="account-dropdown hidden">
                <HeaderDropdownHeader />
                <HeaderDropdownNav />
            </div>
        )
    }
}

export default HeaderDropdown;