import axios from 'axios';
import React from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import RecordRTC from 'recordrtc';
import { Countdown } from './Misc';
import RTCController from '../controllers/RTCController';
import AWSController from '../controllers/AWSController';
import {
    generateSoloAudioAssets,
    generateAudioAssets,
    createAudioEl,
    b64ToBlob,
} from '../utils/AudioUtils';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            countdown: null,
            recorder: null,
            recorderState: 'inactive',
            recordings: [],
            s3Keys: [],
        };
    }

    componentDidMount() {
        RTCController.initialize().then(() => {
            RTCController.handleStream(this.onStream, this.onStreamEnded);
            this.setState({ loading: false });
        });
    }

    componentWillUnmount() {
        RTCController.close();
    }

    onStream = e => {
        var mediaElement = e.mediaElement;
        mediaElement.controls = false;
        document.getElementById('video-container').appendChild(mediaElement);
        if (e.type === 'local') {
            var recorder = RecordRTC(e.stream, { type: 'audio' });
            recorder.onStateChanged = state => {
                this.setState({ recorderState: state });
            };
            this.setState({ recorder });
        }
    };

    onStreamEnded = e => {
        var mediaElement = document.getElementById(e.streamid);
        if (mediaElement) {
            mediaElement.parentNode.removeChild(mediaElement);
        }
        RTCController.close();
    };

    handleCountdownStart = () => {
        var countdown = 3;
        const countdownTimer = setInterval(() => {
            this.setState({ countdown: countdown--, recorderState: '' });
            if (countdown < 0) {
                clearInterval(countdownTimer);
            }
        }, 1000);

        setTimeout(() => {
            if (!this.state.recorder) return;
            return this.state.recorder.startRecording({
                audio: true,
                video: false,
            });
        }, 4000);
    };

    handleRecorderCommand = command => {
        const { recorder } = this.state;
        switch (command) {
            case 'start':
                return this.handleCountdownStart();
            case 'stop':
                return recorder.stopRecording(() => {
                    const audioFile = new File([recorder.getBlob()], `test-${Date.now()}.webm`, {
                        type: 'audio/webm ',
                    });
                    this.setState(prevState => ({
                        recordings: prevState.recordings.concat(audioFile),
                    }));
                });
            case 'pause':
            case 'resume':
                return recorder[`${command}Recording`]();
            default:
                return this[command]();
        }
    };

    onCommandReceived = e => {
        if (e.data.type === 'command' && this.state.recorder) {
            this.handleRecorderCommand(e.data.text);
        }
    };

    onCommandSend = command => {
        if (RTCController.isRoomEmpty()) {
            return generateSoloAudioAssets(this.state.recordings);
        }
        RTCController.sendCommand(command);
        return this.handleRecorderCommand(command);
    };

    onDataReceived = e => {
        var { type, data = [] } = e.data;
        if (type !== 'data' || typeof data !== 'object') {
            return;
        }
        if (data.length && data.length !== this.state.recordings.length) {
            throw new Error('Uneven number of recordings between local and remote streams');
        }

        return generateAudioAssets(data.map((remoteKey, i) => [this.state.s3Keys[i], remoteKey]));
    };

    'upload-audio' = () => {
        AWSController.initialize().then(() => {
            Promise.map(this.state.recordings, recording => AWSController.upload(recording)).then(
                s3Keys => {
                    if (!this.props.isInterviewer) {
                        RTCController.sendData(s3Keys);
                    }
                    this.setState({ s3Keys });
                },
            );
        });
    };

    render() {
        const { loading, countdown, recorderState } = this.state;
        if (loading) return null;
        return this.props.children({
            countdown,
            recorderState,
            onCommandSend: this.onCommandSend,
            onCommandReceived: this.onCommandReceived,
            onDataReceived: this.onDataReceived,
        });
    }
}

export default Room;

Room.propTypes = {
    children: PropTypes.func.isRequired,
    isInterviewer: PropTypes.bool,
};
