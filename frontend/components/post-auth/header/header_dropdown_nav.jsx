import React from "react";
import HeaderDropdownItem from "./header_dropdown_item";

class HeaderDropdownNav extends React.Component {
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
                    {this.navLineItems.map(item => (<HeaderDropdownItem key={item} type={item}/>))}
                </div>
                <div className="account-dropdown-container">
                    {this.supportLineItems.map(item => (<HeaderDropdownItem key={item} type={item}/>))}
                </div>
                <div className="account-dropdown-container logout">
                    <HeaderDropdownItem type="Log Out"/>
                </div>
            </>
        )
    }
}

export default HeaderDropdownNav;