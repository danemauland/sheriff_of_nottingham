import React from "react";
import AccountDropdownItem from "./dropdown_item";

class AccountDropdownNav extends React.Component {
    constructor(props) {
        super(props);
        this.navLineItems = ["Free Stock", "Account", "Banking", "Recurring",
            "History", "Documents", "Settings"]
        this.supportLineItems = ["Help Center", "Contact Us", "Disclosures"]
    }

    render () {
        return (
            <>
                <div className="account-dropdown-container">
                    {this.navLineItems.map(item => (<AccountDropdownItem key={item} type={item}/>))}
                </div>
                <div className="account-dropdown-container">
                    {this.supportLineItems.map(item => (<AccountDropdownItem key={item} type={item}/>))}
                </div>
                <div className="account-dropdown-container logout">
                    <AccountDropdownItem type="Log Out"/>
                </div>
            </>
        )
    }
}

export default AccountDropdownNav;