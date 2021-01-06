import React from "react";
import Logo from "./logo";
import NavLinkHeader from "./nav_link_headers";

class NavLinks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected: ""};
        this.collapseNavMenu = this.collapseNavMenu.bind(this);
        this.generateNavHeader = this.generateNavHeader.bind(this);
        document.addEventListener("click", this.collapseNavMenu);
        this.items = [
            [
                "Products",
                ["Stocks & Funds","Options","Gold","Cash Management","Crypto"]
            ],
            ["Learn", ["Snacks", "Learn"]],
            ["About Me", ["LinkedIn", "Github"]],
        ]
    }

    collapseNavMenu() {
        $(".extended").removeClass("extended");
        $(".nav-bar-wrapper").removeClass("extended-wrapper");
        $(".splash-nav").removeClass("nested-links");
        this.setState({ selected: "" })
    }

    addClickHandler(field) {
        return e => {
            const tar = $(e.currentTarget);

            if (!tar.hasClass("extended")) {
                $(".splash-nav").addClass("nested-links");
                $(".extended").removeClass("extended");
                tar.addClass("extended");
                this.setState({ selected: field });
                e.stopPropagation();
            } else { this.collapseNavMenu() }
        }
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.collapseNavMenu);
    }

    generateNavHeader(item, i) {
        const title = item[0];
        const items = item[1];
        return <NavLinkHeader
            key={i}
            clickHandler={this.addClickHandler(title)}
            title={title}
            items={items}
            selected={this.state.selected === title}
        />
    }

    render() {
        return (
            <div className="nav-bar-wrapper">
                <div className="splash-nav-links-div">
                    <Logo />
                    <div className="dropdowns small-menu hidden-1024">
                        {this.items.map(this.generateNavHeader)}
                    </div>
                </div>
            </div>
        )
    }
}

export default NavLinks