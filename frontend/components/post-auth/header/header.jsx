import React from "react";
import Logo from "./logo";
import SearchBar from "./search_bar";
import NavLinks from "./nav_links";

const Header = () => (
    <header className="dashboard-header" onClick={e => e.stopPropagation()}>
        <div className="dashboard-header-centering-div">
            <Logo />
            <SearchBar />
            <NavLinks />
        </div>
    </header>    
);

export default Header;