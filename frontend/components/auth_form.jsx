import React from "react";
import SessionErrors from "./session_errors"

class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {...props.user}
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
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>Username
                        <input type="text"
                            value={this.state.username}
                            onChange={this.handleChange("username")}/>
                    </label>
                    <label>Password
                        <input type="password"
                            value={this.state.password}
                            onChange={this.handleChange("password")}/>
                    </label>
                    <button>{this.props.formType}</button>
                </form>
                <SessionErrors errors={this.props.errors} />
            </>
        )   
    }
}

export default AuthForm