import React from "react";
import * as FontAwesome from "react-icons/lib/fa";
import "./App.css";

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.selectFiles = this.selectFiles.bind(this);
        this.state = {
            files: [],
            error: ""
        };
    }

    selectFiles(files) {
        if (files.length > 0) {
            this.setState({ files: Array.from(files) });
        }
    }

    sizeInMegaBytes(sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B";
        } else if ((sizeInBytes / (1024 ^ 1)) < 1024) {
            return (sizeInBytes / (1024 ^ 1)).toFixed(2) + " KB";
        } else if ((sizeInBytes / (1024 ^ 2)) < 1024) {
            return (sizeInBytes / (1024 ^ 2)).toFixed(2) + " MB";
        } else {
            return (sizeInBytes / (1024 ^ 3)).toFixed(2) + " GB";
        }
    }

    render() {
        return <div className="container text-center text-dark">
            <h1 className="mt-5 mb-4" style={{ fontSize: "4rem" }}>
                <FontAwesome.FaCloud className="text-dark" />
                &nbsp;
                <FontAwesome.FaHeart className="text-danger" style={{ fontSize: "1.5rem" }} />
                &nbsp;
                <FontAwesome.FaLock className="text-dark" />
            </h1>
            <h4 className="mb-4">Simple file encryption for the cloud.</h4>
            <div className="row justify-content-center mb-4">
                <form className="col-lg-4" onSubmit={e => e.preventDefault()}>
                    <div className="input-group mb-4">
                        <div className="custom-file">
                            <input required multiple type="file" className="custom-file-input" id="file-selector" onChange={e => this.selectFiles(e.target.files)} />
                            <label className="custom-file-label text-left" htmlFor="file-selector">Choose files to get started...</label>
                        </div>
                    </div>
                    {(this.state.files.length > 0) ?
                        <React.Fragment>
                            <ul className="list-group text-left mb-4">
                                {this.state.files.map((file, index) => <li key={index} className="list-group-item p-2">{file.name} <span className="text-secondary">(-{this.sizeInMegaBytes(file.size)})</span></li>)}
                            </ul>
                            <div>
                                <button type="submit" className="btn btn-success mr-2">Encrypt</button>
                                <button type="submit" className="btn btn-primary">Decrypt</button>
                            </div>
                        </React.Fragment>
                        : null}
                </form>
            </div>
        </div>;
    }
}