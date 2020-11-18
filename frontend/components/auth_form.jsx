import React from "react";
import SessionErrors from "./session_errors";
import debounce from "debounce";
import {Link} from "react-router-dom"
import SessionAlternative from "./session_alternative"

class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {...props.user};
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = Object.assign({}, this.state);
        this.props.action(user)
    }

    handleChange(field) {
        return e => this.setState({[field]: e.target.value})
    }

    render() {
        return (
            <div className="auth-section">
                <div className="auth-image-div">
                    {/* <img className="auth-image" src={window.session_image}/> */}
                </div>
                <div className="auth-form-div">
                    <div className="inner-auth-form-div">
                        <form className="auth-form" onSubmit={this.handleSubmit}>
                            <h3>Welcome to Sheriff of Nottingham</h3>
                            <div className="input-div">
                                <label><p>Username</p>
                                    <input type="text"
                                        value={this.state.username}
                                        onChange={this.handleChange("username")}/>
                                </label>
                                <label><p>Password</p>
                                    <input type="password"
                                        value={this.state.password}
                                        onChange={this.handleChange("password")}/>
                                </label>
                                <p>
                                    <SessionAlternative formType={this.props.formType}/>
                                </p>
                                <ul className="session-errors">
                                    <SessionErrors errors={this.props.errors} />
                                </ul>
                            </div>
                            <div className="button-div">
                                <button><p>{this.props.formType}</p></button>
                            </div>
                        </form>
                    </div>
                </div>
            </ div>
        )   
    }
}

export default AuthForm