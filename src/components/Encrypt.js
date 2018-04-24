import React from "react";
import Magic from "../utilities/Magic";
import Config from "../utilities/Config";
import { Redirect, Link } from "react-router-dom";

export default class Encrypt extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.scorePassword = this.scorePassword.bind(this);
        this.encrypt = this.encrypt.bind(this);
        this.state = {
            showPassword: false,
            password: "",
            retypePassword: "",
            working: false
        };
    }

    toggleShowPassword() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    scorePassword(password) {
        let lengthScore = password.length / (Config.maxPasswordLength / 2);
        lengthScore = (lengthScore > 1) ? 1 : lengthScore;
        lengthScore *= 4;
        const hasUpperCase = password.match(/[A-Z]/) ? 1 : 0;
        const hasLowerCase = password.match(/[a-z]/) ? 1 : 0;
        const hasNumbers = password.match(/[0-9]/) ? 1 : 0;
        const hasSymbols = password.match(/[~`!@#$%^&*()_\-+={[}\]\\|:;"'<,>.]/) ? 1 : 0;
        return ((lengthScore + hasUpperCase + hasLowerCase + hasNumbers + hasSymbols) / 8) * 100;
    }

    encrypt() {
        Magic.setStateWithPromise(this, { working: true })
            .then(() => { })
            .then(() => Magic.setStateWithPromise(this, { password: "", retypePassword: "" }))
            .then(() => { })
            .catch(error => Magic.setStateWithPromise(this, { working: false, error }));
    }

    render() {
        const showPassword = this.state.showPassword;
        const passwordScore = this.scorePassword(this.state.password);
        const passwordCheck = (showPassword || this.state.password === this.state.retypePassword);
        return (this.props.files.length > 0) ? <form onSubmit={e => e.preventDefault()}>
            <h4 className="mb-4">Choose a strong password.</h4>
            <div className="input-group">
                <input required autoFocus maxLength={Config.maxPasswordLength} type={(showPassword) ? "text" : "password"} className="form-control" placeholder="Type password" value={this.state.password} onChange={this.handleChange} name="password" />
                <div className="input-group-append">
                    <button tabIndex="-1" className={"btn " + ((showPassword) ? "btn-success" : "btn-danger")} type="button" onClick={this.toggleShowPassword}>{(showPassword) ? "Hide" : "Show"}</button>
                </div>
            </div>
            {(showPassword) ? null :
                <div className="input-group mt-2">
                    <input required maxLength={Config.maxPasswordLength} type="password" className="form-control" placeholder="Retype password" value={this.state.retypePassword} onChange={this.handleChange} name="retypePassword" />
                </div>}
            <div className="progress mt-4 mb-4" style={{ height: "0.2rem" }}>
                <div className={`progress-bar ${((passwordScore < 33.33) ? "bg-danger" : ((passwordScore < 66.67) ? "bg-warning" : "bg-success"))}`} role="progressbar" style={{ width: `${passwordScore}%` }}></div>
            </div>
            <div>
                <Link to="/file_select">
                    <button className="btn btn-light mr-2">Go back</button>
                </Link>
                <button disabled={!passwordCheck} type="submit" className={`btn ${(passwordCheck) ? "btn-success" : "btn-danger"}`}>{(passwordCheck) ? "Encrypt" : "Passwords do not match!"}</button>
            </div>
        </form> : <Redirect to="/file_select" />;
    }
}