import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./nav_links";
import {HiOutlineMenuAlt4} from "react-icons/hi";
import { GrClose } from "react-icons/gr";

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isExpanded: false};
        this.handleClick = this.handleClick.bind(this); 
    }

    handleClick(e) {
        e.preventDefault();

        this.setState({isExpanded: !this.state.isExpanded});
        
        $(".small-menu").toggleClass("hidden-1024");
    }

    render() {
        const isExpanded = this.state.isExpanded;
        return (
            <nav className="splash-nav" onClick={e => e.stopPropagation()}>
                <div className="splash-nav-div">
                    <NavLinks />

                    <div className="nav-session-auth-links" >
                        <Link className="nav-login" to="/login">Log In</Link>

                        <div className="nav-auth-spacer"></div>

                        <Link className="nav-signup rounded-button"to="/signup">
                            Sign Up
                        </Link>
                    </div>
                    
                    <div className="menu-icon" onClick={this.handleClick}>
                        {isExpanded ? <GrClose /> : <HiOutlineMenuAlt4 />}
                    </div>
                </div>
            </nav>    
        )
    }
}
export default Navbar