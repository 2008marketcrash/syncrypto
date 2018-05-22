import React from "react";
import { FaCloud, FaHeart, FaLock } from "react-icons/lib/fa";
import { HashRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import FileSelect from "./FileSelect";
import Encrypt from "./Encrypt";

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.selectFile = this.selectFile.bind(this);

        this.state = {
            file: null
        };
    }

    selectFile(file) {
        this.setState({ file });
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
                            <Route exact path="/file_select" render={() => <FileSelect file={this.state.file} selectFile={this.selectFile} />} />
                            <Route exact path="/encrypt" render={() => <Encrypt file={this.state.file} selectFile={this.selectFile} />} />
                            <Route render={() => <div>
                                <div className="mb-2"><span role="img" aria-label="poop" style={{ fontSize: "2.5rem" }}>&#128169;</span></div>
                                <div className="mb-4">You're not supposed to be on this page!</div>
                                <Link to="/"><button className="btn btn-light">Get outta here!</button></Link>
                            </div>} />
                        </Switch>
                    </div>
                </div>
            </div>
        </HashRouter>;
    }
}