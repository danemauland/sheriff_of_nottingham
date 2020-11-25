import React from "react";
import AccountDropdownHeader from "./account_dropdown_header";
import AccountDropdownNav from "./account_dropdown_nav";

class AccountDropdown extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="account-dropdown hidden">
                <AccountDropdownHeader />
                <AccountDropdownNav />
            </div>
        )
    }
}

export default AccountDropdown;