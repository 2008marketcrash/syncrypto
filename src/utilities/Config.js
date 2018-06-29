export default {
    maxFileSize: 1024 * 1024 * 128,
    maxPasswordLength: 64,
    encoding: "UTF-8",
    fileExtension: "syncrypto",
    key: {
        type: "raw",
        name: "PBKDF2",
        extractable: false,
        operations: ["deriveKey"],
        saltSize: 32,
        hash: "SHA-512",
        iterations: 65536
    },
    algorithm: {
        name: "AES-GCM",
        keySize: 256,
        ivSize: 32,
        tagLength: 128,
        options: {
            encrypt: ["encrypt"],
            decrypt: ["decrypt"]
        }
    },
    googleDrive: {
        developerKey: "AIzaSyDWS9YPyy86r1OE1zeYfrJzeVZMgBTt1cs",
        clientId: "705436738304-p6q37q3s4h2s36m16tot9gab8qb6moom.apps.googleusercontent.com",
        appId: 705436738304,
        scope: "https://www.googleapis.com/auth/drive.readonly"
    }
};
