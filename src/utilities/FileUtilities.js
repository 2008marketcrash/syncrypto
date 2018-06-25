import Config from "./Config";
import axios from "axios";

export default class FileUtilities {
    static sizeString(sizeInBytes) {
        const KB = 1024;
        const MB = KB * 1024;
        const GB = MB * 1024;
        if (sizeInBytes < KB) {
            return sizeInBytes + " B";
        } else if (sizeInBytes < MB) {
            return (sizeInBytes / KB).toFixed(2) + " KB";
        } else if (sizeInBytes < GB) {
            return (sizeInBytes / MB).toFixed(2) + " MB";
        } else {
            return (sizeInBytes / GB).toFixed(2) + " GB";
        }
    }

    static readFile(file, withSaltAndIv = false) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = (error) => { reject(error); };
            reader.onabort = () => { reject("File reading aborted!"); };
            reader.onload = (event) => {
                const { result } = event.target;
                if (withSaltAndIv) {
                    resolve(FileUtilities.extractSaltAndIvFromData(result));
                } else {
                    resolve({
                        data: result
                    });
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    static extractSaltAndIvFromData(data) {
        const fileSize = data.byteLength;
        const { saltSize } = Config.key;
        const { ivSize } = Config.algorithm;
        return {
            data: data.slice(0, fileSize - saltSize - ivSize),
            salt: data.slice(fileSize - saltSize - ivSize, fileSize - ivSize),
            iv: data.slice(fileSize - ivSize)
        };
    }

    static saveFile(fileName, data, salt = [], iv = []) {
        const url = window.URL.createObjectURL(new Blob([data, salt, iv], { type: "application/octet-stream" }));
        const a = document.createElement("a");
        a.style = "display:none";
        document.body.appendChild(a);
        a.href = url
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    };

    static downloadFile(file_id, access_token, withSaltAndIv = false) {
        return axios.request({
            method: "GET",
            responseType: "arraybuffer",
            url: `https://www.googleapis.com/drive/v3/files/${file_id}`,
            params: { alt: "media" },
            headers: { "Authorization": `Bearer ${access_token}` }
        }).then(response => {
            if (withSaltAndIv) {
                return FileUtilities.extractSaltAndIvFromData(response.data);
            } else {
                return {
                    data: response.data
                };
            }
        })
    }
}