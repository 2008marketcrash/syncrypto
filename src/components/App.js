import React from "react";
import { FaCloud, FaHeart, FaLock } from "react-icons/lib/fa";
import { HashRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import FileSelect from "./FileSelect";
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";
import Help from "./Help";
import Legal from "./Legal";
import Magic from "../utilities/Magic";
import Save from "./Save";

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.selectFile = this.selectFile.bind(this);

        this.state = {
            inputFile: null,
            outputFile: null
        };
    }

    selectFile(inputFile = null, outputFile = null) {
        return Magic.setStateWithPromise(this, { inputFile, outputFile });
    }

    componentDidCatch(error, info) {
        this.setState({ error, stack: info.componentStack.trim() });
    }

    render() {
        return <HashRouter>
            <div>
                <div className="d-flex flex-column flex-md-row align-items-center p-2 px-md-4 mb-2 bg-white border-bottom">
                    <img style={{ height: "32px" }} src="favicon.ico" />
                    <h5 className="ml-2 my-0 mr-md-auto font-weight-normal text-dark">Syncrypto</h5>
                    <nav className="my-2 my-md-0">
                        <Link className="p-2 text-dark" to="/">Home</Link>
                        <a className="p-2 text-dark" target="_blank" href="https://github.com/apurpate/syncrypto">GitHub</a>
                        <Link className="p-2 text-dark" to="/help">Help</Link>
                        <Link className="p-2 text-dark" to="/legal">Legal</Link>
                    </nav>
                </div>
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
                                    <div className="alert alert-danger mb-4" style={{ wordBreak: "break-word" }}>{this.state.error}</div>
                                    <pre className="bg-light rounded p-3 text-danger text-left">{this.state.stack}</pre>
                                </div> :
                                <Switch>
                                    <Redirect exact from="/" to="/file_select" />
                                    <Route exact path="/file_select" render={() => <FileSelect
                                        inputFile={this.state.inputFile}
                                        outputFile={this.state.outputFile}
                                        selectFile={this.selectFile} />} />
                                    <Route exact path="/encrypt" render={() => <Encrypt
                                        inputFile={this.state.inputFile}
                                        outputFile={this.state.outputFile}
                                        selectFile={this.selectFile} />} />
                                    <Route exact path="/decrypt" render={() => <Decrypt
                                        inputFile={this.state.inputFile}
                                        outputFile={this.state.outputFile}
                                        selectFile={this.selectFile} />} />
                                    <Route exact path="/save" render={() => <Save
                                        inputFile={this.state.inputFile}
                                        outputFile={this.state.outputFile}
                                        selectFile={this.selectFile} />} />
                                    <Route exact path="/help" render={() => <Help />} />
                                    <Route exact path="/legal" render={() => <Legal />} />
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
            </div>
        </HashRouter>;
    }
}
