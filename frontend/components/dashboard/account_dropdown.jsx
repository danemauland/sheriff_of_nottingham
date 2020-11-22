import React from "react";
import AccountDropdownHeader from "./account_dropdown_header";
import LogoutContainer from "./logout_container";

class AccountDropdown extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="account-dropdown hidden">
                <AccountDropdownHeader />
                <LogoutContainer />
            </div>
        )
    }
}

export default AccountDropdown;