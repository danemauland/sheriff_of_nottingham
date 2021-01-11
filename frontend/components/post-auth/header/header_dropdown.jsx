import React from "react";
import DropdownHeader from "./header_dropdown_header";
import DropdownNav from "./header_dropdown_nav";

class HeaderDropdown extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="account-dropdown hidden">
                <DropdownHeader />
                <DropdownNav />
            </div>
        )
    }
}

export default HeaderDropdown;