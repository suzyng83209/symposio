var ffmpeg = require('fluent-ffmpeg');

function mergeAudio(audioPath1, audioPath2) {
    ffmpeg()
        .input(audioPath1)
        .input(audioPath2)
        .filterGraph(['blah blah']);
}

module.exports = {
    merge: mergeAudio
};
