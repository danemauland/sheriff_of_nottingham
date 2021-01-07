import React from "react";
import { withRouter } from "react-router-dom";

class Initialize extends React.Component {

    componentDidUpdate(prevProps) {
        const isLoggedIn = this.props.isLoggedIn;

        let wasLoggedIn;
        if (!prevProps) {
            wasLoggedIn = !isLoggedIn;
            const meta = document.createElement("meta");
            
            meta.setAttribute("name", "color-scheme");

            document.getElementsByTagName("head")[0].appendChild(meta);
        } else wasLoggedIn = prevProps.isLoggedIn;

        if (isLoggedIn !== wasLoggedIn) {
            const tag = $('meta[name="color-scheme"]');
            const body = $("body");

            if (isLoggedIn) {
                tag.attr("content", "dark");
                body.addClass("dark");
            } else {
                tag.attr("content", "light"); 
                body.removeClass("dark");
            }
        }
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    render() {return <></>}
}

export default withRouter(Initialize);