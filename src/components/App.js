import React from "react";
import { FaCloud, FaHeart, FaLock } from "react-icons/lib/fa";
import { HashRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import FileSelect from "./FileSelect";
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.selectFile = this.selectFile.bind(this);

        this.state = {
            inputFile: null
        };
    }

    selectFile(inputFile) {
        this.setState({ inputFile });
    }

    componentDidCatch(error, info) {
        this.setState({ error, stack: info.componentStack.trim() });
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
                        {this.state.error ?
                            <div>
                                <div className="alert alert-danger mb-4">{this.state.error}</div>
                                <pre className="bg-light rounded p-3 text-danger text-left">{this.state.stack}</pre>
                            </div> :
                            <Switch>
                                <Redirect exact from="/" to="/file_select" />
                                <Route exact path="/file_select" render={() => <FileSelect file={this.state.inputFile} selectFile={this.selectFile} />} />
                                <Route exact path="/encrypt" render={() => <Encrypt file={this.state.inputFile} selectFile={this.selectFile} />} />
                                <Route exact path="/decrypt" render={() => <Decrypt file={this.state.inputFile} selectFile={this.selectFile} />} />
                                <Route render={() => <div>
                                    <div className="mb-2"><span role="img" aria-label="poop" style={{ fontSize: "2.5rem" }}>&#128169;</span></div>
                                    <div className="mb-4">You&quot;re not supposed to be on this page!</div>
                                    <Link to="/"><button className="btn btn-light">Get outta here!</button></Link>
                                </div>} />
                            </Switch>
                        }
                    </div>
                </div>
            </div>
        </HashRouter>;
    }
}
