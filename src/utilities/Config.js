export default {
    maxFileSize: 1024 * 1024 * 25,
    maxNumberOfFiles: 25,
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
        ivSize: 16,
        tagLength: 128,
        options: {
            encrypt: ["encrypt"],
            decrypt: ["decrypt"]
        }
    }

    // TODO more consts
};