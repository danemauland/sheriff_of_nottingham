import React from "react";
import HeaderDropdown from "./header_dropdown";
import NavLinksItem from "./nav_links_item";
import { connect } from "react-redux";
import {
    getValueIncreased,
} from "../../../util/extract_from_state_utils";
import {
    flashCash,
} from "../../../actions/ui_actions";

const mapStateToProps = state => ({
    color: getValueIncreased(state) ? "dark-green" : "red",
});

const mapDispatchToProps = dispatch => ({
    flashCash: () => dispatch(flashCash()),
});

const removeClasses = tar => {
    tar.removeClass("red");
    tar.removeClass("red-bottom-border");
    tar.removeClass("dark-green");
    tar.removeClass("dark-green-bottom-border");
};

const LINK_NAMES = ["Free Stocks", "Portfolio", "Cash", "Messages", "Account"];

class NavLinks extends React.Component {
    constructor(props) {
        super(props);
        this.toggleHidden = this.toggleHidden.bind(this);
    }

    toggleHidden(e) {
        e.preventDefault();
        
        const tar = $(e.target)
        
        removeClasses(tar);
        
        const dropdown = tar.siblings();
        const isHidden = dropdown.hasClass("hidden");

        if (isHidden) {
            tar.addClass(this.props.color);
            tar.addClass(`${this.props.color}-bottom-border`);
        }

        dropdown.toggleClass("hidden");
        const wasHidden = isHidden;

        const wholeDocClickRemover = () => {
            removeClasses(tar);
            dropdown.addClass("hidden");
            document.removeEventListener("click", wholeDocClickRemover);
        };

        if (wasHidden) {
            document.addEventListener("click", wholeDocClickRemover)
        } else {
            document.removeEventListener("click", wholeDocClickRemover)
        }
    }

    genClickHandler(name) {
        if (name === "Account") return this.toggleHidden;
        if (name === "Cash") return this.props.flashCash;

        return e => e.preventDefault();
    }

    getProps(name, i) {
        return ({
            name,
            key: i,
            clickHandler: this.genClickHandler(name),
            divClass: name === "Account" ? "absolute-positioner" : "",
            classNames: `navbar-link ${this.props.color}-hover`,
            child: name === "Account" ? <HeaderDropdown/> : <></>,
        })
    }

    render() {
        return (
            <div className="dashboard-nav-links-positioner">
                <ul className="dashboard-nav-links-wrapper">
                    {LINK_NAMES.map((name, i) => (
                        <NavLinksItem {...this.getProps(name, i)} />
                    ))}
                </ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavLinks);