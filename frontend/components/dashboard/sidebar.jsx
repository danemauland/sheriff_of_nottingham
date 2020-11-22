import React from "react";

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dashboard-sidebar-spacer">
                <div className="dashboard-sidebar-wrapper">
                    <div className="sidebar-placeholder"></div>
                </div>
            </div>
        )
    }
}

export default Sidebar;