import React from "react";

class Initialize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: this.props.location.pathname}
    }
    componentDidUpdate() {
        const tag = $('meta[name="color-scheme"]');
        const body = $("body");
        if (tag.length === 1) {
            if (this.props.location.pathname.slice(0, 10) === "/dashboard") {
                tag.attr("content", "dark");
                body.addClass("dark");
            } else {
                tag.attr("content", "light"); 
                body.removeClass("dark");
            }
        } else if (tag.length === 0) {
            const meta = document.createElement("meta");
            meta.setAttribute("name", "color-scheme");
            if (this.props.location.pathname.slice(0,10) === "/dashboard") {
                meta.setAttribute("content", "dark");
                body.addClass("dark");
            } else {
                meta.setAttribute("content", "light");
                body.removeClass("dark");
            }
            document.getElementsByTagName("head")[0].appendChild(meta);
        }
    }
    componentDidMount() {
        this.componentDidUpdate();
    }
    render() {return <></>}
}

export default Initialize