import React from "react";
import Magic from "../utilities/Magic";
import Config from "../utilities/Config";
import { Redirect, Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";

export default class Encrypt extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.scorePassword = this.scorePassword.bind(this);
        this.encrypt = this.encrypt.bind(this);

        this.state = {
            showPassword: false,
            password: "",
            retypePassword: "",
            working: false,
            error: ""
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

    handleSubmit(event) {
        event.preventDefault();
        this.encrypt(this.props.inputFile);
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

    encrypt(inputFile) {
        const salt = window.crypto.getRandomValues(new Uint8Array(Config.key.saltSize));
        const iv = window.crypto.getRandomValues(new Uint8Array(Config.algorithm.ivSize));
        let data;
        return Magic.setStateWithPromise(this, { working: true })
            .then(() => {
                if (inputFile.isCloud) {
                    return FileUtilities.downloadFileFromGoogleDrive(inputFile.id, inputFile.access_token, false);
                } else {
                    return FileUtilities.readFileFromDevice(inputFile, false);
                }
            })
            .then(readInputFile => { data = readInputFile.data; })
            .then(() => window.crypto.subtle.importKey(
                Config.key.type,
                new TextEncoder(Config.encoding).encode(btoa(this.state.password)),
                { name: Config.key.name },
                Config.key.extractable,
                Config.key.operations))
            .then(pbkdf2Key => {
                return Magic.setStateWithPromise(this, { password: "", retypePassword: "" })
                    .then(() => window.crypto.subtle.deriveKey(
                        {
                            name: Config.key.name,
                            salt,
                            iterations: Config.key.iterations,
                            hash: { name: Config.key.hash }
                        },
                        pbkdf2Key,
                        {
                            name: Config.algorithm.name,
                            length: Config.algorithm.keySize
                        },
                        Config.key.extractable,
                        Config.algorithm.options.encrypt
                    ));
            })
            .then(key => window.crypto.subtle.encrypt(
                {
                    name: Config.algorithm.name,
                    iv,
                    tagLength: Config.algorithm.tagLength
                },
                key,
                data
            ))
            .then(encryptedFile => this.props.selectFile(null, {
                name: `${inputFile.name}.${Config.fileExtension}`,
                data: encryptedFile,
                salt,
                iv
            }))
            .catch(error => Magic.setStateWithPromise(this, { error: error.toString() }))
            .then(() => Magic.setStateWithPromise(this, { working: false }));
    }

    render() {
        const { showPassword, working } = this.state;
        const passwordScore = this.scorePassword(this.state.password);
        const passwordCheck = showPassword || this.state.password === this.state.retypePassword;
        if (this.props.outputFile) {
            return <Redirect to="/save" />;
        } else if (this.props.inputFile) {
            if (working) {
                return <div>
                    <h4 className="mb-4">Encrypting...</h4>
                    <div className="text-secondary mb-4">Go take a nap or something.<br />Or talk to this dude while you wait.</div>
                    <span role="img" aria-label="poop" style={{ fontSize: "2.5rem" }}>&#128585;</span>
                </div>;
            } else {
                return <form onSubmit={this.handleSubmit}>
                    <h4 className="mb-4">Choose a strong password.</h4>
                    {this.state.error ? <div className="mb-4 alert alert-danger">{this.state.error}</div> : null}
                    <div className="input-group">
                        <input required autoFocus autoComplete="off" maxLength={Config.maxPasswordLength} type={showPassword ? "text" : "password"} className="form-control" placeholder="Type password" value={this.state.password} onChange={this.handleChange} name="password" />
                        <div className="input-group-append">
                            <button tabIndex="-1" className={"btn " + (showPassword ? "btn-success" : "btn-danger")} type="button" onClick={this.toggleShowPassword}>{showPassword ? "Hide" : "Show"}</button>
                        </div>
                    </div>
                    {showPassword ? null :
                        <div className="input-group mt-2">
                            <input required autoComplete="off" maxLength={Config.maxPasswordLength} type="password" className="form-control" placeholder="Retype password" value={this.state.retypePassword} onChange={this.handleChange} name="retypePassword" />
                        </div>}
                    <div className="progress mt-4" style={{ height: "0.2rem" }}>
                        <div className={`progress-bar ${passwordScore < 33.33 ? "bg-danger" : (passwordScore < 66.67 ? "bg-warning" : "bg-success")}`} role="progressbar" style={{ width: `${passwordScore}%` }}></div>
                    </div>
                    <div className="mt-4">
                        <Link tabIndex="-1" to="/file_select">
                            <button tabIndex="-1" className="btn btn-light mr-2">Go back</button>
                        </Link>
                        <button disabled={!passwordCheck} type="submit" className={`btn ${passwordCheck ? "btn-success" : "btn-danger"}`}>{passwordCheck ? "Encrypt" : "Passwords do not match!"}</button>
                    </div>
                </form>
            }
        } else {
            return <Redirect to="/" />;
        }
    }
}