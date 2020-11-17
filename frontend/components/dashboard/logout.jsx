import React from "react";

class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(e) {
        this.props.logout()
    }

    render() {
        return (
            <p onClick={this.logout}>Log Out</p>
        )
    }
}

export default Logout