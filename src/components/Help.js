import React from "react";

export default class Help extends React.Component {
    render() {
        return <div>
            <h4 className="mb-4">Need some help?</h4>
            <div className="text-left">
                <div className="mb-4">
                    <div className="text-dark">How does this tool help me?</div>
                    <div className="text-secondary">This tool helps you encrypt/decrypt your files using a password. It is safer to encrypt your file before your send them over of the internet or store them in the cloud.</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">What if I lose the password I used to encrypt my files?</div>
                    <div className="text-secondary">This tool's integrity relies entirely on your password. No one can decrypt your files without the password you set and we do not collect it (for good reason). Please try not to lose it or forget it. Write it down in a safe place or a use a password manager.</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">How are my files encrypted?</div>
                    <div className="text-secondary">This tool uses the AES GCM 256 implementation provided by <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">Web Crypto</a>. All the work is done right in your browser. Take a look at the <a target="_blank" href="https://github.com/apurpate/syncrypto">source code</a> if you have questions about the specifics.</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">What type of files are supported?</div>
                    <div className="text-secondary">Only binary files are supported at this moment (basically everything except Google Docs files). You may see an error message complaining about "http status 403" if you try to work with Google Docs files (Docs, Sheets, Slides, Forms, etc). Working on fixing that! Think you can help? Head over to the <a target="_blank" href="https://github.com/apurpate/syncrypto">repository</a> and submit a pull request!</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">I see "Error: idpiframe_initialization_failed. Cookies are not enabled in current environment." when I try to connect to Google Drive&trade;.</div>
                    <div className="text-secondary">You need to enable 3rd party cookies in your browser for the Google API to work properly.</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">I see "Error: popup_closed_by_user." when I try to connect to Google Drive&trade;.</div>
                    <div className="text-secondary">You may need to allow pop ups in your browser. If not, just try clicking the button again. This is a known issue. &#128531;</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">Is there a warranty? How about a license?</div>
                    <div className="text-secondary">This tool is open source and licensed as <a target="_blank" href="https://github.com/apurpate/syncrypto/blob/master/LICENSE">Apache 2</a>. Use it at your own risk, the contributors are not liable.</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">Are you collecting my data?</div>
                    <div className="text-secondary">This tool tracks nothing more than the demographics of people that visit the site using <a target="_blank" href="https://www.google.com/analytics/">Google Analytics</a>. None of your files are collected. Look at the <a target="_blank" href="https://github.com/apurpate/syncrypto">source code</a> if you want to verify yourself.</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">I think I can make this tool better/safer. How can I contribute?</div>
                    <div className="text-secondary">Send a <a target="_blank" href="https://github.com/apurpate/syncrypto/pulls">pull request</a>!</div>
                </div>
                <div className="mb-4">
                    <div className="text-dark">This tool doesn't work for me! I have more questions! How can I reach the contributors?</div>
                    <div className="text-secondary">You can either open an issue in the <a target="_blank" href="https://github.com/apurpate/syncrypto">GitHub</a> repositoy or email <a target="_blank" href="mailto:someone@example.com">airplaneap@gmail.com</a> to say hello.</div>
                </div>
            </div>
        </div >;
    }
}
