const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');

function mergeAudio(audioPath1, audioPath2) {
    var outputFile = process.env.UPLOAD_FOLDER + 'combined-' + Date.now().toString();

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(audioPath1)
            .input(audioPath2)
            .audioFilters('amix=inputs=2:duration=longest:dropout_transition=0')
            .audioCodec('libmp3lame')
            .on('start', () => console.log('starting merging process'))
            .on('error', reject)
            .on('end', () => {
                console.log('success');
                resolve(outputFile);
            })
            .save(outputFile);
    });
}

function convert(originalAudio) { // I just want to chain it. Sue me.
    this.to = outputType => {
        const filePath = originalAudio.replace(/.[a-zA-Z0-9]+$/, `.${outputType}`);
        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(originalAudio)
                .format(outputType)
                .on('error', err => {
                    console.log(err);
                    reject(err);
                })
                .on('end', () => {
                    resolve(filePath);
                })
                .save(filePath);
        });
    };
    return this;
}

module.exports = {
    merge: mergeAudio,
    convert,
};
