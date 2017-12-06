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

module.exports = {
    merge: mergeAudio
};
