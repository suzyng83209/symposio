import axios from 'axios';
import React from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import RecordRTC from 'recordrtc';
import { Countdown } from './styled-components/Misc';
import RTCController from '../controllers/RTCController';
import AWSController from '../controllers/AWSController';
import { generateSoloAudioAssets, generateAudioAssets } from '../utils/AudioUtils';

const COUNTDOWN = 3;
const COUNTDOWN_TIME = 1000;

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
        var countdown = COUNTDOWN;
        const countdownTimer = setInterval(() => {
            this.setState({ countdown: countdown-- });
            if (countdown < 0) {
                clearInterval(countdownTimer);
            }
        }, COUNTDOWN_TIME);

        setTimeout(() => {
            if (!this.state.recorder) return;
            return this.state.recorder.startRecording({
                audio: true,
                video: false,
            });
        }, (COUNTDOWN + 1) * COUNTDOWN_TIME);
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
        if (RTCController.isRoomEmpty() && command === 'upload-audio') {
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
                    this.setState(prevState => ({ s3Keys: prevState.s3Keys.concat(s3Keys) }));
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
