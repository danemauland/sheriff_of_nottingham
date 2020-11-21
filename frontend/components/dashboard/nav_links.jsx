import React from "react";
import {Link} from "react-router-dom";

class NavLinks extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="dashboard-nav-links-positioner">
                <ul className="dashboard-nav-links-wrapper">
                    <li><Link to="#">Free Stocks</Link></li>
                    <li><Link to="#">Portfolio</Link></li>
                    <li><Link to="#">Cash</Link></li>
                    <li><Link to="#">Messages</Link></li>
                    <li><Link to="#">Account</Link></li>
                </ul>
            </div>
        )
    }
}

export default NavLinks