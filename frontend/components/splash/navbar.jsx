import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./nav_links";
import {HiOutlineMenuAlt4} from "react-icons/hi";
import { GrClose } from "react-icons/gr";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {expanded: false};
        this.handleClick = this.handleClick.bind(this); 
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({expanded: !this.state.expanded});
        $(".small-menu").toggleClass("hidden");
        
    }

    render() {
        return (
            <nav className="splash-nav" onClick={e => e.stopPropagation()}>
                <div className="splash-nav-div">
                    <NavLinks />
                    <div className="nav-session-auth-links small-menu hidden" >
                        <Link className="nav-login" to="/login">Log In</Link>
                        <div className="nav-auth-spacer"></div>
                        <Link className="nav-signup rounded-button" to="/signup">Sign Up</Link>
                    </div>
                    <div className="menu-icon" onClick={this.handleClick}>
                        {this.state.expanded ? <GrClose /> : <HiOutlineMenuAlt4 />}
                    </div>
                </div>
            </nav>    
        )
    }
}
export default Navbar