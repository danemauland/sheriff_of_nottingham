import React from "react";

class Initialize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: this.props.location.pathname}
    }
    componentDidUpdate(prevProps) {
        const isDashboard = (
            this.props.location.pathname.slice(0, 10) === "/dashboard"
        );
        let wasDashboard;
        
        if (!prevProps) {
            wasDashboard = !isDashboard;
            const meta = document.createElement("meta");
            meta.setAttribute("name", "color-scheme");
            document.getElementsByTagName("head")[0].appendChild(meta);
        } else {
            wasDashboard = (
                prevProps.location.pathname.slice(0, 10) === "/dashboard"
            );
        }

        
        if (isDashboard !== wasDashboard) {
            const tag = $('meta[name="color-scheme"]');
            const body = $("body");
            if (isDashboard) {
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

export default Initialize