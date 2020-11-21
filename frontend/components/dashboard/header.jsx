import React from "react";
import { Link } from "react-router-dom";
import Logo from "./logo"
import SearchBar from "./search_bar"
import NavLinks from "./nav_links";

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header className="dashboard-header" onClick={e => e.stopPropagation()}>
                <div className="dashboard-header-centering-div">
                    <Logo />
                    <SearchBar />
                    <NavLinks />
                </div>
            </header>    
        )
    }
}
export default Header