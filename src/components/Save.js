import React from "react";
import Config from "../utilities/Config";
import { Redirect, Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";
import GoogleApi from "../utilities/GoogleApi";

export default class Save extends React.Component {
    constructor(props) {
        super(props);
        this.setMessage = this.setMessage.bind(this);
        this.download = this.download.bind(this);
        this.saveToGoogleDrive = this.saveToGoogleDrive.bind(this);

        this.state = {
            message: null
        };
    }

    setMessage(text, isInfo = false) {
        this.setState({ message: { text, isInfo } });
    }

    download() {
        FileUtilities.saveFileToDevice(
            this.props.outputFile.name,
            this.props.outputFile.data,
            this.props.outputFile.salt,
            this.props.outputFile.iv
        );
    }

    saveToGoogleDrive() {
        if (GoogleApi.isNotReady()) {
            this.setMessage("Google API not loaded!");
        } else {
            const token = GoogleApi.token();
            if (token && token.access_token) {
                FileUtilities.uploadFileToGoogleDrive(
                    token.access_token,
                    this.setMessage,
                    this.props.outputFile.name,
                    this.props.outputFile.data,
                    this.props.outputFile.salt,
                    this.props.outputFile.iv
                );
            } else {
                // We must call "saveToGoogleDrive" instead of "FileUtilities.uploadFileToGoogleDrive" because of:
                // https://github.com/google/google-api-javascript-client/issues/409
                GoogleApi.authenticate(this.saveToGoogleDrive, this.setMessage);
            }
        }
    }

    componentDidMount() {
        if (GoogleApi.isApiReady()) {
            GoogleApi.onApiLoad();
        } else {
            this.setMessage("Google API not loaded!");
        }
    }

    render() {
        if (this.props.outputFile) {
            const encrypted = this.props.outputFile.name.endsWith(`.${Config.fileExtension}`);
            return <div>
                <h4 className="mb-4">Your file has been {encrypted ? "encrypted" : "decrypted"}! &#127881;</h4>
                {this.state.message ? <div className={`mb-4 alert alert-${this.state.message.isInfo ? "info" : "danger"}`} style={{ wordBreak: "break-word" }}>{this.state.message.text}</div> : null}
                <div className="mb-4">
                    <button onClick={this.download} className="btn btn-success mr-2">Save to device</button>
                    <button onClick={this.saveToGoogleDrive} className="btn btn-outline-primary">Save to Google Drive&trade;</button>
                </div>
                <div className="col-9 mx-auto">
                    <hr className="mb-4" />
                    <Link tabIndex="-1" to="/">
                        <button className="btn btn-dark mr-2">Start over</button>
                    </Link>
                </div>
            </div >;
        } else {
            return <Redirect to="/" />;
        }
    }
}
