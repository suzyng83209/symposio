import moment from 'moment';
import RTCMultiConnectionService from '../services/RTCMultiConnectionService';

const SOCKET_URL = 'https://rtcmulticonnection.herokuapp.com:443/';

var RTCController = {
    _initialized: false,
    _instance: null,

    initialize() {
        if (RTCController._initialized) {
            return Promise.resolve();
        }

        return RTCMultiConnectionService.load().then(() => {
            var connection = new window.RTCMultiConnection();

            connection.socketURL = SOCKET_URL;

            connection.session = {
                audio: true,
                video: true,
                data: true
            };

            connection.mediaConstraints = {
                audio: true,
                video: true
            };

            connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };

            connection.enableFileSharing = true;

            connection.maxParticipantsAllowed = 1;

            this._instance = connection;
            RTCController._initialized = true;
        });
    },

    getInstance() {
        return this._instance;
    },

    handleStream(onStream = () => {}, onStreamEnded = () => {}) {
        const connection = this._instance;
        if (!connection && !this._initialized) {
            return;
        }

        connection.onstream = onStream;

        connection.onstreamended = onStreamEnded;
    },

    handleMessage(onMessage = () => {}) {
        this._instance.onmessage = e => {
            console.log(`[MESSAGE RECEIVED] - ${e.data.type}`);
            onMessage(e);
        };
    },

    open(roomId = 'main') {
        return Promise.resolve(this._instance.openOrJoin(roomId));
    },

    join(roomId = 'main') {
        const peers = this._instance.getAllParticipants();
        if (peers.length >= this._instance.maxParticipantsAllowed) {
            throw new Error('Room is full');
        }
        return Promise.resolve(this._instance.join(roomId));
    },

    isRoomEmpty() {
        var isEmpty = !this._instance.getAllParticipants().length;
        return isEmpty;
    },

    isRoomFull() {
        return this._instance.getAllParticipants().length >= this._instance.maxParticipantsAllowed;
    },

    close() {
        var connection = this._instance;

        connection.getAllParticipants().map(pid => {
            connection.disconnectWith(pid);
        });

        // stop all local cameras
        connection.attachStreams.map(localStream => {
            localStream.stop();
        });

        // close socket.io connection
        connection.closeSocket();
    },

    sendData(data) {
        this._instance.send({
            type: 'data',
            data
        });
    },

    sendMessage(message) {
        this._instance.send({
            type: 'message',
            text: message
        });
    },

    sendCommand(command) {
        this._instance.send({
            type: 'command',
            text: command,
            time: moment()
        });
    },

    checkRoom(roomId) {
        return new Promise(resolve =>
            this._instance.checkPresence(roomId, isRoomExists => {
                return resolve(isRoomExists);
            })
        );
    }
};

export default RTCController;
