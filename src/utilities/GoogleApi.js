import Config from "./Config";

export default class GoogleApi {
    static isNotReady() {
        return !GoogleApi.isApiReady() || !GoogleApi.isAuthReady() || !GoogleApi.isPickerReady();
    }

    static isApiReady() {
        return !!window.gapi;
    }

    static isAuthReady() {
        return !!window.gapi.auth;
    }

    static isPickerReady() {
        return !!window.google.picker;
    }

    static onApiLoad() {
        window.gapi.load("auth");
        window.gapi.load("picker");
    }

    static token() {
        return window.gapi.auth.getToken();
    }

    static authenticate(callback, setError) {
        window.gapi.auth.authorize({
            client_id: Config.googleDrive.clientId,
            scope: Config.googleDrive.scope
        }, (access_token) => {
            if (access_token.error) {
                setError = setError || console.log;
                setError(`Error: ${access_token.error}. ${access_token.details || ""}`.trim());
            } else {
                callback(access_token);
            }
        });
    }
}