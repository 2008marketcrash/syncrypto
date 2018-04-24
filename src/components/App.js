import React from "react";
import { FaCloud, FaHeart, FaLock } from "react-icons/lib/fa";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import FileSelect from "./FileSelect";
import Encrypt from "./Encrypt";

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

    render() {
        return <HashRouter>
            <div className="container text-center text-dark">
                <h1 className="mt-5 mb-4" style={{ fontSize: "4rem" }}>
                    <FaCloud className="text-dark" />
                    &nbsp;
                <FaHeart className="text-danger" style={{ fontSize: "1.5rem" }} />
                    &nbsp;
                <FaLock className="text-dark" />
                </h1>
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-6">
                        <Switch>
                            <Redirect exact from="/" to="/file_select" />
                            <Route exact path="/file_select" render={() => <FileSelect files={this.state.files} selectFiles={this.selectFiles} />} />
                            <Route exact path="/encrypt" render={() => <Encrypt files={this.state.files} />} />
                            <Route render={() => <div>
                                <div><span style={{ fontSize: "2.5rem" }}>&#128169;</span></div>
                                <div>You're not supposed to be on this page!</div>
                            </div>} />
                        </Switch>
                    </div>
                </div>
            </div>
        </HashRouter>;
    }
}