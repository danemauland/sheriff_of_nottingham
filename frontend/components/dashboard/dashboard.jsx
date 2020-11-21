import React from "react";
import {Link} from "react-router-dom";
import Header from "./header";
import LogoutContainer from "./logout_container"

class Dashboard extends React.Component {

    render() {
        return (
            <>
                <Header />
                {/* <LogoutContainer /> */}
            </>
        )
    }
}
export default Dashboard;