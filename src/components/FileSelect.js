import React from "react";
import { Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";
import Config from "../utilities/Config";
import GoogleDrivePicker from "./GoogleDrivePicker";

export default class FileSelect extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error: ""
        };
    }

    render() {
        const { inputFile } = this.props;
        const isFileValid = inputFile && inputFile.size <= Config.maxFileSize;
        return <form onSubmit={e => e.preventDefault()}>
            <h4 className="mb-4">Simple and accessible file encryption.</h4>
            {this.state.error ? <div className="mb-4 alert alert-danger">{this.state.error}</div> : null}
            <div className="input-group mb-4">
                <div className="col-8 pl-0 pr-2">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="file-selector" onChange={e => this.props.selectFile(Array.from(e.target.files)[0], null)} />
                        <label className="custom-file-label text-left text-truncate" htmlFor="file-selector">{inputFile ? inputFile.name : "Choose a file to get started..."}</label>
                    </div>
                </div>
                <GoogleDrivePicker
                    setError={(error) => this.setState({ error })}
                    onPick={file => this.props.selectFile(file, null)}
                    className="col-4 pl-2 pr-0 btn btn-outline-primary" />
            </div>
            {inputFile ?
                <React.Fragment>
                    <div className="card text-left mb-4">
                        <div className="card-body">
                            <h5 className="card-title text-truncate">{inputFile.name}</h5>
                            <p className="card-text">
                                Size: <span className={inputFile.size > Config.maxFileSize ? "text-danger" : "text-success"}>{FileUtilities.sizeString(inputFile.size)}</span>
                                <br />
                                Type: <span className="text-secondary">{inputFile.type || `${inputFile.name.split(".").pop().toLowerCase() === Config.fileExtension ? "Syncrypto encrypted file" : "Unknown"} (.${inputFile.name.split(".").pop()})`}</span>
                                <br />
                                Last modified: <span className="text-secondary">{new Date(inputFile.lastModified).toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                    {isFileValid ?
                        <div>
                            <Link tabIndex="-1" to="/encrypt">
                                <button type="submit" className="btn btn-success mr-2">Encrypt</button>
                            </Link>
                            <Link tabIndex="-1" to="/decrypt">
                                <button type="submit" className="btn btn-primary">Decrypt</button>
                            </Link>
                        </div> :
                        <div className="alert alert-danger">The selected file is too big. The maximum allowed file size is {FileUtilities.sizeString(Config.maxFileSize)}. Please try a smaller file.</div>}
                </React.Fragment>
                : null}
        </form>;
    }
}
