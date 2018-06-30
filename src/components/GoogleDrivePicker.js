import React from "react";
import Config from "../utilities/Config";
import GoogleApi from "../utilities/GoogleApi";

export default class GoogleDrivePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.createPicker = this.createPicker.bind(this);
        this.pickerCallback = this.pickerCallback.bind(this);
    }

    handleClick() {
        if (GoogleApi.isReady()) {
            this.props.setError("Google API not loaded!");
        } else {
            const token = GoogleApi.token();
            if (token && token.access_token) {
                this.createPicker(token.access_token);
            } else {
                // We must call "handleClick" instead of "createPicker" because of:
                // https://github.com/google/google-api-javascript-client/issues/409
                GoogleApi.authenticate(this.handleClick, this.props.setError);
            }
        }
    }

    createPicker(access_token) {
        new window.google.picker.PickerBuilder()
            .addView(window.google.picker.ViewId.DOCS)
            .setOAuthToken(access_token)
            .setAppId(Config.googleDrive.appId)
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
        if (GoogleApi.isApiReady()) {
            GoogleApi.onApiLoad();
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
