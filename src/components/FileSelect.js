import React from "react";
import { Link } from "react-router-dom";
import FileUtilities from "../utilities/FileUtilities";

export default class FileSelect extends React.PureComponent {
    render() {
        return <form onSubmit={e => e.preventDefault()}>
            <h4 className="mb-4">Simple file encryption for the cloud.</h4>
            <div className="input-group mb-4">
                <div className="custom-file">
                    <input required multiple type="file" className="custom-file-input" id="file-selector" onChange={e => this.props.selectFiles(e.target.files)} />
                    <label className="custom-file-label text-left" htmlFor="file-selector">Choose files to get started...</label>
                </div>
            </div>
            {(this.props.files.length > 0) ?
                <React.Fragment>
                    <ul className="list-group text-left mb-4">
                        {this.props.files.map((file, index) => <li key={index} className="list-group-item p-2 text-truncate">
                            {file.name} <span className="text-secondary">({FileUtilities.sizeString(file.size)})</span>
                        </li>)}
                    </ul>
                    <div>
                        <Link to="/encrypt">
                            <button type="submit" className="btn btn-success mr-2">Encrypt</button>
                        </Link>
                        <Link to="/decrypt">
                            <button type="submit" className="btn btn-primary">Decrypt</button>
                        </Link>
                    </div>
                </React.Fragment>
                : null}
        </form>;
    }
}