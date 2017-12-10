import axios from 'axios';
import Promise from 'bluebird';
import AWSController from '../controllers/AWSController';

const generateTranscriptButton = s3Key => {
    var getTranscriptButton = document.createElement('button');
    const id = `transcript-${s3Key}`;
    getTranscriptButton.id = id;
    getTranscriptButton.innerHTML = 'Transcript';
    getTranscriptButton.onclick = () =>
        axios.get(`/api/transcript?localKey=${s3Key}`).then(res => {
            const previousButton = document.getElementById(id);
            const transcriptContainer = document.getElementById('transcripts');
            const newButton = document.createElement('a');
            newButton.innerHTML = 'Transcript';
            newButton.href = res.Location;
            newButton.download = true;
            transcriptContainer.appendChild(newButton);
            if (previousButton) {
                transcriptContainer.removeChild(previousButton);
            }
        });
    return getTranscriptButton;
};

/** For single User
 * Iterates through the recordings, generating files
 * and <audio /> tags while appending them to
 * the audio container with id="local_assets"
 * @param {array} recordings - base64 encoded dataUris
 */
export const generateSoloAudioAssets = (recordings = []) => {
    var audioContainerEl = document.getElementById('local_assets');
    var transcriptContainerEl = document.getElementById('transcripts');
    AWSController.initialize()
        .then(() => Promise.map(recordings, file => AWSController.upload(file)))
        .then(res => {
            res.map(s3 => {
                audioContainerEl.appendChild(createAudioEl(s3.Location));
                transcriptContainerEl.appendChild(generateTranscriptButton(s3.Key));
            });
            return;
        });
};

export const generateAudioAssets = (recordings = []) => {
    return axios.post(`api/merge`, { data: recordings });
};

export const b64ToBlob = (b64Data, contentType = '', sliceSize = 512) => {
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
    return blob;
};

export const createAudioEl = src => {
    var audio = document.createElement('audio');
    audio.controls = 'controls';
    audio.preload = 'metadata';
    audio.volume = 1;
    audio.src = src;
    return audio;
};
