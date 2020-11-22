import React from "react";
import {Link} from "react-router-dom";
import AccountDropdown from "./account_dropdown";

class NavLinks extends React.Component {
    constructor(props) {
        super(props);
        this.toggleHidden = this.toggleHidden.bind(this);
    }

    toggleHidden(e) {
        e.preventDefault();
        const dropdown = $(e.target).siblings();
        $(e.target).toggleClass("orange-red")
        $(e.target).toggleClass("orange-red-bottom-border")
        dropdown.toggleClass("hidden");
        const wholeDocClickRemover = () => {
            $(e.target).toggleClass("orange-red")
            $(e.target).toggleClass("orange-red-bottom-border")
            dropdown.toggleClass("hidden");
            document.removeEventListener("click", wholeDocClickRemover)
        }
        if (!dropdown.hasClass("hidden")) {
            document.addEventListener("click", wholeDocClickRemover)
        } else {
            document.removeEventListener("click", wholeDocClickRemover)
        }
    }

    render() {
        return (
            <div className="dashboard-nav-links-positioner">
                <ul className="dashboard-nav-links-wrapper">
                    <li><a className="navbar-link" href="" onClick={e => e.preventDefault()}>Free Stocks</a></li>
                    <li><a className="navbar-link" href="" onClick={e => e.preventDefault()}>Portfolio</a></li>
                    <li><a className="navbar-link" href="" onClick={e => e.preventDefault()}>Cash</a></li>
                    <li><a className="navbar-link" href="" onClick={e => e.preventDefault()}>Messages</a></li>
                    <li>
                        <div className="absolute-positioner">
                            <Link to="#" className="navbar-link" onClick={this.toggleHidden}>Account</Link>
                            <AccountDropdown onClick={e => e.stopPropagation()}/>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

export default NavLinks