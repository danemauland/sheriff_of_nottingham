import React from "react";
import SessionErrors from "./session_errors";
import SessionAlternative from "./session_alternative";
import Logo from "./splash/logo";

class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDemo = this.handleDemo.bind(this);
        this.state = {...props.user};
    }

    componentWillUnmount() {
        this.props.clearSessionErrors();
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = Object.assign({}, this.state);
        this.props.action(user)
    }

    handleChange(field) {
        return e => this.setState({[field]: e.target.value})
    }

    handleDemo(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.createDemo();
    }

    render() {
        return (
            <div className="auth-section">
                <div className="auth-image-div">
                </div>
                <div className="auth-form-div">
                    <div className="inner-auth-form-div">
                        <form className="auth-form" onSubmit={this.handleSubmit}>
                            <h3>Welcome to <Logo /></h3>
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
                                { this.props.createDemo ? 
                                    <button className="demo-button" onClick={this.handleDemo}>Demo</button> :
                                    <></>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </ div>
        )   
    }
}

export default AuthForm