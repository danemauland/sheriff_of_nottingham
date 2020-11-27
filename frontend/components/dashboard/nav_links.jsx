import React from "react";
import {Link} from "react-router-dom";
import AccountDropdown from "./account_dropdown";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return ({
        valueIncreased: state.ui.valueIncreased,
    })
}

class NavLinks extends React.Component {
    constructor(props) {
        super(props);
        this.toggleHidden = this.toggleHidden.bind(this);
        this.highlightCash = this.highlightCash.bind(this);
    }

    toggleHidden(e) {
        e.preventDefault();
        const tar = $(e.target)
        const dropdown = $(e.target).siblings();
        const toggleOff = tar.hasClass("red") || tar.hasClass("dark-green");
        tar.removeClass("red");
        tar.removeClass("red-bottom-border");
        tar.removeClass("dark-green");
        tar.removeClass("dark-green-bottom-border");
        if (!toggleOff) {
            tar.addClass(this.props.valueIncreased ? "dark-green" : "red");
            tar.addClass(this.props.valueIncreased ? "dark-green-bottom-border" : "red-bottom-border");
        }
        dropdown.toggleClass("hidden");
        const wholeDocClickRemover = () => {
            tar.removeClass("red");
            tar.removeClass("red-bottom-border");
            tar.removeClass("dark-green");
            tar.removeClass("dark-green-bottom-border");
            dropdown.addClass("hidden");
            document.removeEventListener("click", wholeDocClickRemover);
        }
        if (!dropdown.hasClass("hidden")) {
            document.addEventListener("click", wholeDocClickRemover)
        } else {
            document.removeEventListener("click", wholeDocClickRemover)
        }
    }

    highlightCash(e) {
        e.preventDefault();
        const cashContainer = $(".cash-container");
        const cashExpanderButton = $(".cash-expander-button");
        if (!cashContainer.hasClass("cash-container-expanded")) {
            cashExpanderButton.trigger("click");
        }
        cashContainer.addClass("flash");
        window.setTimeout(() => {
            cashContainer.removeClass("flash")
        },1000)
    }

    render() {
        return (
            <div className="dashboard-nav-links-positioner">
                <ul className="dashboard-nav-links-wrapper">
                    <li><a className={"navbar-link " + (this.props.valueIncreased ? "dark-green-hover" : "red-hover")} href="" onClick={e => e.preventDefault()}>Free Stocks</a></li>
                    <li><a className={"navbar-link " + (this.props.valueIncreased ? "dark-green-hover" : "red-hover")} href="" onClick={e => e.preventDefault()}>Portfolio</a></li>
                    <li><a className={"navbar-link " + (this.props.valueIncreased ? "dark-green-hover" : "red-hover")} href="" onClick={this.highlightCash}>Cash</a></li>
                    <li><a className={"navbar-link " + (this.props.valueIncreased ? "dark-green-hover" : "red-hover")} href="" onClick={e => e.preventDefault()}>Messages</a></li>
                    <li>
                        <div className="absolute-positioner">
                            <Link to="#" className={"navbar-link " + (this.props.valueIncreased ? "dark-green-hover" : "red-hover")} onClick={this.toggleHidden}>Account</Link>
                            <AccountDropdown onClick={e => e.stopPropagation()}/>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(NavLinks);