import React from "react";
import Initialize from "./initialize";
import {connect} from "react-redux";
import Modal from "./modal.jsx";
import PostAuth from "./post-auth/post-auth";
import PreAuth from "./pre-auth/pre-auth";

const App = ({isLoggedIn}) => (
    <>
        <Modal />
        <Initialize isLoggedIn={isLoggedIn}/>
        {isLoggedIn ? <PostAuth /> : <PreAuth />}
    </>
)

const mapStateToProps = state => ({
    isLoggedIn: !!state.session.username,
});

export default connect(mapStateToProps, null)(App);