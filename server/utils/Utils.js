function downloadFile(file) {
    if (!fs.existsSync(process.env.UPLOAD_FOLDER)) {
        fs.mkdirSync(process.env.UPLOAD_FOLDER);
    }

    var url = url.indexOf('http') === -1 ? 'http:' + url : url,
        localFile = process.env.UPLOAD_FOLDER + file.name,
        file = fs.createWriteStream(localFile),
        rem = request({ url: url });

    return new Promise((resolve, reject) => {
        rem.on('data', chunk => {
            file.write(chunk);
        });
        rem.on('end', () => {
            resolve(localFile);
        });

        rem.on('error', reject);
    });
}

function downloadB64Data(b64Data, fileName) {
    if (!fs.existsSync(process.env.UPLOAD_FOLDER)) {
        fs.mkdirSync(process.env.UPLOAD_FOLDER);
    }

    if (/^data:[a-z]+\/[a-z]+;base64,/.test(b64Data)) {
        b64Data = b64Data.replace(/^data:[a-z]+\/[a-z]+;base64,/, ''); // or b64Data.splice(b64Data.lastIndexOf(',') + 1)
    }

    var filePath = process.env.UPLOAD_FOLDER + fileName;

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, b64Data, 'base64', err => {
            if (err) reject(err);
            resolve(filePath);
        });
    });
}

function cleanUp() {
    const dirPath = process.env.UPLOAD_FOLDER;
    return new Promise(function(resolve, reject) {
        try {
            var files = fs.readdirSync(dirPath);
        } catch (e) {
            return reject(e);
        }
        if (files.length > 0) {
            files.map(file => {
                const filePath = dirPath + '/' + file;
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                } else {
                    rmDir(filePath);
                }
            });
        }
        resolve();
    });
}

function b64toBlob(b64Data, fileName, contentType = '', sliceSize = 512) {
    if (/^data:[a-z]+\/[a-z]+;base64,/.test(b64Data)) {
        b64Data = b64Data.replace(/^data:[a-z]+\/[a-z]+;base64,/, ''); // or b64Data.splice(b64Data.lastIndexOf(',') + 1)
    }
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i += 1) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    blob.lastModifiedDate = new Date();
    blob.name = fileName || 'test';
    return blob;
}

// replace(/^data:[a-z]+\/[a-z]+;base64,/, "")

module.exports = {
    downloadFile,
    downloadB64Data,
    cleanUp
};
