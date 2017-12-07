import axios from 'axios';

/** For single User
 * Iterates through the recordings, generating files
 * and <audio /> tags while appending them to
 * the audio container with id="local_assets"
 * @param {array} recordings - base64 encoded dataUris
 */
function generateSoloAudioAssets(recordings = []) {
    recordings.reduce((audioContainerEl, base64, i) => {
        const blob = b64ToBlob(base64);
        const file = new File([blob], `local-${i}-${Date.now()}.webm`);
        audioContainerEl.appendChild(createAudioEl(file));
        return audioContainerEl;
    }, document.getElementById('local_assets'));
    return;
}

function generateAudioAssets(recordings = []) {
    return axios.post(`api/merge`, { data: recordings });
}

function b64ToBlob(b64Data, contentType = '', sliceSize = 512) {
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
}

function createAudioEl(src) {
    var audio = document.createElement('audio');
    audio.controls = 'controls';
    audio.preload = 'metadata';
    audio.volume = 1;
    audio.src = src;
    return audio;
}

export default {
    generateSoloAudioAssets,
    generateAudioAssets,
    createAudioEl,
    b64ToBlob
};
