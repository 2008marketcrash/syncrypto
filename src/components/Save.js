import React from "react";
import Config from "../utilities/Config";
import { Redirect, Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";

export default class Save extends React.Component {
    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
        this.saveToGoogleDrive = this.saveToGoogleDrive.bind(this);

        this.state = {
            error: ""
        };
    }

    download() {
        FileUtilities.downloadFileToDevice(
            this.props.outputFile.name,
            this.props.outputFile.data,
            this.props.outputFile.salt,
            this.props.outputFile.iv
        );
    }

    saveToGoogleDrive() {
        console.log("To do.");
    }

    render() {
        if (this.props.outputFile) {
            const encrypted = this.props.outputFile.name.endsWith(`.${Config.fileExtension}`);
            return <div>
                <h4 className="mb-4">Your file has been {encrypted ? "encrypted" : "decrypted"}! &#127881;</h4>
                {this.state.error ? <div className="mb-4 alert alert-danger">{this.state.error}</div> : null}
                <div className="mb-4">
                    <button onClick={this.download} className="btn btn-success mr-2">Download</button>
                    <button onClick={this.saveToGoogleDrive} className="btn btn-outline-primary">Save to Google Drive™</button>
                </div>
                <div className="col-9 mx-auto">
                    <hr className="mb-4" />
                    <Link tabIndex="-1" to="/">
                        <button className="btn btn-dark mr-2">Start over</button>
                    </Link>
                </div>
            </div>;
        } else {
            return <Redirect to="/" />;
        }
    }
}