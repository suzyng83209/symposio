import axios from 'axios';
import Promise from 'bluebird';
import FileSaver from 'file-saver';
import AWSController from '../controllers/AWSController';

const COLOUR = {
    local: 'red',
    remote: 'green',
    combined: 'yellow',
};

const createAsset = (s3, type) => {
    const asset = document.createElement('div');
    asset.appendChild(createLabel(type));
    asset.appendChild(createAudioEl(s3.Location));
    asset.appendChild(generateTranscriptButton(s3.Key));
    asset.style = 'grid-column: 1; display: flex;';
    return asset;
};

const createLabel = text => {
    var label = document.createElement('div');
    label.innerHTML = text;
    label.style = [
        `background: ${COLOUR[text]}`,
        'grid-column: 1',
        'color: white',
        'padding: 4px',
        'display: flex',
        'min-width: 48px',
        'border-radius: 4px',
        'align-items: center',
        'box-sizing: border-box',
        'justify-content: center',
    ].join(';');
    return label;
};

const createAudioEl = src => {
    var source = document.createElement('source');
    source.type = 'audio/webm';
    source.src = src;

    var audio = document.createElement('audio');
    audio.style = 'grid-column: 2; width: 100%;';
    audio.controls = 'controls';
    audio.preload = 'metadata';
    audio.volume = 1;
    audio.appendChild(source);
    return audio;
};

const generateTranscriptButton = (localKey = '', remoteKey = '') => {
    var transcriptButton = document.createElement('button');
    const id = `transcript-${localKey}-${remoteKey}`;
    transcriptButton.style = 'grid-column: 3;';
    transcriptButton.innerHTML = 'Transcript';
    transcriptButton.id = id;
    transcriptButton.onclick = () => {
        transcriptButton.innerHTML = '...';
        axios
            .get(`/api/transcript?localKey=${localKey}&remoteKey=${remoteKey}`)
            .then(({ Location, Key }) => {
                transcriptButton.innerHTML = 'Transcript';
                const download = document.createElement('a');
                download.href = Location;
                download.download = Key;
                download.click();
            });
    };
    return transcriptButton;
};

/** For single User
 * Iterates through the recordings, generating files
 * and <audio /> tags while appending them to
 * the audio container with id="local_assets"
 * @param {array} recordings - base64 encoded dataUris
 */
export const generateSoloAudioAssets = (recordings = []) => {
    var containerEl = document.getElementById('assets');
    AWSController.initialize()
        .then(() => Promise.map(recordings, file => AWSController.upload(file)))
        .then(res => {
            // completely replace previous children
            while (containerEl.firstChild) {
                containerEl.removeChild(containerEl.firstChild);
            }
            res.map(s3 => {
                containerEl.appendChild(createLabel('local'));
                containerEl.appendChild(createAudioEl(s3.Location));
                containerEl.appendChild(generateTranscriptButton(s3.Key));
            });
            return;
        });
};

export const generateAudioAssets = (recordings = []) => {
    const container = document.getElementById('assets');
    return axios.post(`api/merge`, { data: recordings }).then(({ data }) => {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        recordings.map(([s3Local, s3Remote], i) => {
            const combinedSource = ((data.s3Keys || {})[i] || {}).Location;
            container.appendChild(createLabel('combined'));
            container.appendChild(createAudioEl(combinedSource));
            container.appendChild(generateTranscriptButton(s3Local.Key, s3Remote.Key));

            container.appendChild(createLabel('local'));
            container.appendChild(createAudioEl(s3Local.Location));
            container.appendChild(generateTranscriptButton(s3Local.Key));

            container.appendChild(createLabel('remote'));
            container.appendChild(createAudioEl(s3Remote.Location));
            container.appendChild(generateTranscriptButton(s3Remote.Key));
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
