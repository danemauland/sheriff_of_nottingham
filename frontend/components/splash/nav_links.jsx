import React from "react";
import Logo from "./logo";
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

    componentDidMount() {
        $(".green-hover").mouseover(e => {
            e.stopPropagation();
            let tar = $(e.target);
            while (tar.is("path") || tar.is("svg")) { tar = tar.parent() }
            tar.addClass("dark-green");
        }).mouseout(e => {
            let tar = $(e.target);
            while (tar.is("path") || tar.is("svg")) { tar = tar.parent() }
            e.stopPropagation();
            tar.removeClass("dark-green");
        })
    }

    render() {
        return (
            <div className="nav-bar-wrapper">
                <div className="splash-nav-links-div">
                    <Logo />
                    <div className="dropdowns small-menu hidden-1024">
                        <span>
                            <button className="green-hover" onClick={this.addClickHandler("products")}>Products {this.state.selected === "products" ? <CgChevronUp /> : <CgChevronDown />}</button>
                            <ul className="product-list">
                                <li className="green-hover"><a href="#">Stocks &amp; Funds</a></li>
                                <li className="green-hover"><a href="#">Options</a></li>
                                <li className="green-hover"><a href="#">Gold</a></li>
                                <li className="green-hover"><a href="#">Cash Management</a></li>
                                <li className="crypto-li"><a href="#">Crypto</a></li>
                            </ul>
                        </span>
                        <span>
                            <button className="green-hover" onClick={this.addClickHandler("learn")}>Learn  {this.state.selected === "learn" ? <CgChevronUp /> : <CgChevronDown />}</button>
                            <ul className="learn-list">
                                <li className="green-hover"><a href="#">Snacks</a></li>
                                <li className="green-hover"><a href="#">Learn</a></li>
                            </ul>
                        </span>
                        <span>
                            <button className="green-hover" onClick={this.addClickHandler("about")}>About Me {this.state.selected === "about" ? <CgChevronUp /> : <CgChevronDown />}</button>
                            <ul className="about-list">
                                <li className="green-hover"><a target="_blank" href="https://www.linkedin.com/in/dane-m-63a34412a/">LinkedIn</a></li>
                                <li className="green-hover"><a target="_blank" href="https://github.com/danemauland">Github</a></li>
                            </ul>
                        </span>
                    </div>
                </div>

            </div>
        )
    }
}

export default NavLinks