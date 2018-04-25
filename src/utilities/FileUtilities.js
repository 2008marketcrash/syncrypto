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

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = (error) => { reject(error); };
            reader.onabort = () => { reject("File reading aborted!"); };
            reader.onload = (event) => { resolve(event.target.result); };
            reader.readAsArrayBuffer(file);
        });
    }
}