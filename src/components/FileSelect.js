import React from "react";
import { Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";
import Config from "../utilities/Config";

export default class FileSelect extends React.PureComponent {
    render() {
        const { file } = this.props;
        const isFileValid = file && file.size <= Config.maxFileSize;
        return <form onSubmit={e => e.preventDefault()}>
            <h4 className="mb-4">Simple file encryption for the cloud.</h4>
            <div className="input-group mb-4">
                <div className="custom-file">
                    <input required type="file" className="custom-file-input" id="file-selector" onChange={e => this.props.selectFile(Array.from(e.target.files)[0])} />
                    <label className="custom-file-label text-left" htmlFor="file-selector">{file ? file.name : "Choose a file to get started..."}</label>
                </div>
            </div>
            {file ?
                <React.Fragment>
                    <div className="card text-left mb-4">
                        <div className="card-body">
                            <h5 className="card-title text-truncate">{file.name}</h5>
                            <p className="card-text">
                                Size: <span className={file.size > Config.maxFileSize ? "text-danger" : "text-success"}>{FileUtilities.sizeString(file.size)}</span>
                                <br />
                                Type: <span className="text-secondary">{file.type || `Unknown (.${file.name.split(".").pop()})`}</span>
                                <br />
                                Last modified: <span className="text-secondary">{file.lastModifiedDate.toLocaleString()}</span>
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