import BaseService from './BaseService';

export default {
    load() {
        var jsFiles = [
            'https://rtcmulticonnection.herokuapp.com/dist/RTCMultiConnection.min.js',
            'https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js',
            'https://cdn.webrtc-experiment.com:443/FileBufferReader.js'
        ];

        return BaseService.load(jsFiles, 'RTCMultiConnection').then(() => {
            return window.RTCMultiConnection;
        });
    }
};
