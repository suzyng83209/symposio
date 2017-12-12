const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');

function mergeAudio(audioPath1, audioPath2) {
    var outputFile = process.env.UPLOAD_FOLDER + `combined-${Date.now()}.webm`;

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(audioPath1)
            .input(audioPath2)
            .complexFilter('[0:0][1:0] amix=inputs=2:duration=longest')
            .on('start', () => console.log('[FFMPEG] - AUDIO MERGE START'))
            .on('error', reject)
            .on('end', () => {
                console.log('[FFMPEG] - AUDIO MERGE SUCCESS');
                resolve(outputFile);
            })
            .save(outputFile);
    });
}

function convert(originalAudio) {
    // I just want to chain it. Sue me.
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
    mergeAudio,
    convert,
};
