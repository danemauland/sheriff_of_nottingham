import React from "react";
import {connect} from "react-redux";
import Modal from "./modal.jsx";
import PostAuth from "./post-auth/post-auth";
import PreAuth from "./pre-auth/pre-auth";
import {
    getUsername,
    getModal,
} from "../util/extract_from_state_utils";

const mapStateToProps = state => ({
    isLoggedIn: !!getUsername(state),
    modalIsOpen: !!getModal(state),
});

class App extends React.Component {

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

    componentDidMount() { this.componentDidUpdate(); }

    render() {
        return (<>
            {this.props.modalIsOpen ? <Modal /> : <></>}
            {this.props.isLoggedIn ? <PostAuth /> : <PreAuth />}
        </>)
    }
}

export default connect(mapStateToProps, null)(App);