import React from "react";
import Magic from "../utilities/Magic";
import Config from "../utilities/Config";
import { Redirect, Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";

export default class Decrypt extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.decrypt = this.decrypt.bind(this);

        this.state = {
            showPassword: false,
            password: "",
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
        this.decrypt(this.props.file);
    }

    decrypt(file) {
        let data, salt, iv;
        return Magic.setStateWithPromise(this, { working: true })
            .then(() => {
                if (file.isCloud) {
                    return FileUtilities.downloadFile(file.id, file.access_token, true);
                } else {
                    return FileUtilities.readFile(file, true);
                }
            })
            .then(readFile => { data = readFile.data; salt = readFile.salt; iv = readFile.iv; })
            .then(() => window.crypto.subtle.importKey(
                Config.key.type,
                new TextEncoder(Config.encoding).encode(btoa(this.state.password)),
                { name: Config.key.name },
                Config.key.extractable,
                Config.key.operations))
            .then(pbkdf2Key => {
                return Magic.setStateWithPromise(this, { password: "" })
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
                        Config.algorithm.options.decrypt
                    ));
            })
            .then(key => window.crypto.subtle.decrypt(
                {
                    name: Config.algorithm.name,
                    iv,
                    tagLength: Config.algorithm.tagLength
                },
                key,
                data
            ))
            .then(decryptedFile => FileUtilities.saveFile(file.name.substring(0, file.name.lastIndexOf(".")) || `decrypted.${Config.fileExtension}`, decryptedFile))
            .then(() => this.props.selectFile(null))
            .catch(error => Magic.setStateWithPromise(this, { error: error.toString() }))
            .then(() => Magic.setStateWithPromise(this, { working: false }));
    }

    render() {
        const { showPassword, working } = this.state;
        if (this.props.file) {
            if (working) {
                return <div>
                    <h4 className="mb-4">Decrypting...</h4>
                    <div className="text-secondary mb-4">Go take a nap or something.<br />Or talk to this dude while you wait.</div>
                    <span role="img" aria-label="poop" style={{ fontSize: "2.5rem" }}>&#128585;</span>
                </div>;
            } else {
                return <form onSubmit={this.handleSubmit}>
                    {this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : null}
                    <h4 className="mb-4">Enter the password you chose.</h4>
                    <div className="input-group">
                        <input required autoFocus autoComplete="off" maxLength={Config.maxPasswordLength} type={showPassword ? "text" : "password"} className="form-control" placeholder="Type password" value={this.state.password} onChange={this.handleChange} name="password" />
                        <div className="input-group-append">
                            <button tabIndex="-1" className={"btn " + (showPassword ? "btn-success" : "btn-danger")} type="button" onClick={this.toggleShowPassword}>{showPassword ? "Hide" : "Show"}</button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link tabIndex="-1" to="/file_select">
                            <button className="btn btn-light mr-2" tabIndex="-1">Go back</button>
                        </Link>
                        <button disabled={this.state.password.length <= 0} type="submit" className="btn btn-primary">Decrypt</button>
                    </div>
                </form>
            }
        } else {
            return <Redirect to="/" />;
        }
    }
}