import React from "react";
import Config from "../utilities/Config";

export default class GoogleDrivePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.state = {
            disabled: false
        };
    }

    isGoogleApiReady() {
        return !!window.gapi;
    }

    isGoogleAuthReady() {
        return !!window.gapi.auth;
    }

    isGooglePickerReady() {
        return !!window.google.picker;
    }

    onApiLoad() {
        window.gapi.load("auth");
        window.gapi.load("picker");
    }

    handleClick() {
        if (!this.isGoogleApiReady()
            || !this.isGoogleAuthReady()
            || !this.isGooglePickerReady()) {
            this.setState({ disabled: true });
            this.props.setError("Google API not loaded!");
        } else {
            const token = window.gapi.auth.getToken();
            if (token && token.access_token) {
                this.createPicker(token.access_token);
            } else {
                // We must call "handleClick" instead of "createPicker" because of:
                // https://github.com/google/google-api-javascript-client/issues/409
                this.authenticate(this.handleClick);
            }
        }
    }

    authenticate(callback) {
        window.gapi.auth.authorize({
            client_id: Config.googleDrive.clientId,
            scope: Config.googleDrive.scope
        }, (access_token) => {
            if (access_token.error) {
                this.setState({ disabled: true });
                this.props.setError(`Error: ${access_token.error}. ${access_token.details}.`);
            } else {
                callback(access_token);
            }
        });
    }

    createPicker() {
        console.log("To do.");
    }

    componentDidMount() {
        if (this.isGoogleApiReady()) {
            this.onApiLoad();
        } else {
            this.setState({ disabled: true });
            this.props.setError("Google API not loaded!");
        }
    }

    render() {
        return <button
            className={this.props.className}
            onClick={this.handleClick}
            disabled={this.state.disabled}>
            Google Drive™
        </button>;
    }
}
