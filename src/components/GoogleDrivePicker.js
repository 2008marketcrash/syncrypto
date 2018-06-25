import React from "react";
import Config from "../utilities/Config";

export default class GoogleDrivePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.isGoogleApiReady = this.isGoogleApiReady.bind(this);
        this.isGoogleAuthReady = this.isGoogleAuthReady.bind(this);
        this.isGooglePickerReady = this.isGooglePickerReady.bind(this);
        this.onApiLoad = this.onApiLoad.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.createPicker = this.createPicker.bind(this);
        this.pickerCallback = this.pickerCallback.bind(this);
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
                this.props.setError(`Error: ${access_token.error}. ${access_token.details}`);
            } else {
                callback(access_token);
            }
        });
    }

    createPicker(access_token) {
        new window.google.picker.PickerBuilder()
            .addView(window.google.picker.ViewId.DOCS)
            .setOAuthToken(access_token)
            .setDeveloperKey(Config.googleDrive.developerKey)
            .setCallback(data => this.pickerCallback(data, access_token))
            .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
            .build()
            .setVisible(true);
    }

    pickerCallback(data, access_token) {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const file = data[window.google.picker.Response.DOCUMENTS][0];
            this.props.setError("");
            this.props.onPick({
                isCloud: true,
                lastModified: file.lastEditedUtc,
                size: file.sizeBytes,
                type: file.mimeType,
                name: file.name,
                url: file.url,
                id: file.id,
                access_token
            });
        }
    }

    componentDidMount() {
        if (this.isGoogleApiReady()) {
            this.onApiLoad();
        } else {
            this.props.setError("Google API not loaded!");
        }
    }

    render() {
        return <button
            className={this.props.className}
            onClick={this.handleClick}
            disabled={this.props.disabled}>
            Google Drive™
        </button>;
    }
}
