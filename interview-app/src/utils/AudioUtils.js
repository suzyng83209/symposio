import axios from 'axios';
import Promise from 'bluebird';
import FileSaver from 'file-saver';
import AWSController from '../controllers/AWSController';

const generateTranscriptButton = (localKey = '', remoteKey = '') => {
    var getTranscriptButton = document.createElement('button');
    const id = `transcript-${localKey}-${remoteKey}`;
    getTranscriptButton.id = id;
    getTranscriptButton.innerHTML = 'Transcript';
    getTranscriptButton.style = 'grid-column: 1; grid-row: 1;';
    getTranscriptButton.onclick = () =>
        axios.get(`/api/transcript?localKey=${localKey}&remoteKey=${remoteKey}`).then(res => {
            const previousButton = document.getElementById(id);
            const transcriptContainer = document.getElementById('transcripts');
            const newButton = document.createElement('a');
            newButton.href = res.Location;
            newButton.click();
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
            // completely replace previous children
            while (audioContainerEl.firstChild) {
                audioContainerEl.removeChild(audioContainerEl.firstChild);
            }
            res.map(s3 => {
                audioContainerEl.appendChild(createAudioEl(s3.Location));
                transcriptContainerEl.appendChild(generateTranscriptButton(s3.Key));
            });
            return;
        });
};

export const generateAudioAssets = (recordings = []) => {
    const getContainer = id => document.getElementById(id);
    return axios.post(`api/merge`, { data: recordings }).then(({ s3Keys }) => {
        recordings.map(([s3Local, s3Remote]) => {
            getContainer('local_assets').appendChild(createAudioEl(s3Local.Location));
            getContainer('remote_assets').appendChild(createAudioEl(s3Remote.Location));
            getContainer('transcripts').appendChild(
                generateTranscriptButton(s3Local.Key, s3Remote.Key),
            );
        });
        s3Keys.map(key => {
            getContainer('combined_assets').appendChild(createAudioEl(key.Location));
        });
    });
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
    var source = document.createElement('source');
    source.type = 'audio/webm';
    source.src = src;

    var audio = document.createElement('audio');
    audio.controls = 'controls';
    audio.preload = 'metadata';
    audio.volume = 1;
    audio.style = 'width: 100%; grid-row: 1; grid-column: 1;';
    audio.appendChild(source);
    return audio;
};
