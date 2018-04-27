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

    static readFileAsBase64String(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = (error) => { reject(error); };
            reader.onabort = () => { reject("File reading aborted!"); };
            reader.onload = (event) => { resolve(btoa(new Uint8Array(event.target.result))); };
            reader.readAsArrayBuffer(file);
        });
    }

    static saveBase64StringAsFile(fileName, base64String) {
        const url = window.URL.createObjectURL(new Blob([base64String], { type: "application/octet-stream" }));
        const a = document.createElement("a");
        a.style = "display:none";
        document.body.appendChild(a);
        a.href = url
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    };
}