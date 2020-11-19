import React from "react";
import Logo from "./logo"
import { CgChevronDown, CgChevronUp } from "react-icons/cg";

class NavLinks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected: ""}
        document.addEventListener("click", () => {
            $(".extended").removeClass("extended");
            $(".nav-bar-wrapper").removeClass("extended-wrapper");
            $(".splash-nav").removeClass("nested-links");
            this.setState({ selected: "" })
        })
    }

    addClickHandler(field) {
        return e => {
            let tar = $(e.target);
            while (tar.is("path") || tar.is("svg")) { tar = tar.parent() }
            // console.log(e.target);
            // console.log(tar);
            if (!tar.hasClass("extended")) {
                $(".splash-nav").addClass("nested-links");
                $(".extended").removeClass("extended");
                tar.addClass("extended");
                this.setState({ selected: field });
                e.stopPropagation();
            } else {
                $(".extended").removeClass("extended");
                $(".nav-bar-wrapper").removeClass("extended-wrapper");
                $(".splash-nav").removeClass("nested-links");
                this.setState({ selected: "" })
            }
        }
    }

    render() {
        return (
            <div className="nav-bar-wrapper">
                <div className="splash-nav-links-div">
                    <Logo />
                    <div className="dropdowns">
                        <span>
                            <button onClick={this.addClickHandler("products")}>Products {this.state.selected === "products" ? <CgChevronDown /> : <CgChevronUp />}</button>
                            <ul className="product-list">
                                <li><a href="#">Stocks &amp; Funds</a></li>
                                <li><a href="#">Options</a></li>
                                <li><a href="#">Gold</a></li>
                                <li><a href="#">Cash Management</a></li>
                                <li className="crypto-li"><a href="#">Crypto</a></li>
                            </ul>
                        </span>
                        <span>
                            <button onClick={this.addClickHandler("learn")}>Learn  {this.state.selected === "learn" ? <CgChevronDown /> : <CgChevronUp />}</button>
                            <ul className="learn-list">
                                <li><a href="#">Learn</a></li>
                                <li><a href="#">Snacks</a></li>
                            </ul>
                        </span>
                        <span>
                            <button onClick={this.addClickHandler("about")}>About Me {this.state.selected === "about" ? <CgChevronDown /> : <CgChevronUp />}</button>
                            <ul className="about-list">
                                <li><a href="#">LinkedIn</a></li>
                                <li><a href="#">Github</a></li>
                            </ul>
                        </span>
                    </div>
                </div>

            </div>
        )
    }
}

export default NavLinks