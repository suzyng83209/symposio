import React from 'react';
import PropTypes from 'prop-types';
import { Text } from './styled-components/Texts';
import { IconButton } from './styled-components/Buttons';
import { GridWrapper } from './styled-components/Misc';

const AutoGrid = GridWrapper.extend`
    grid-auto-rows: 32px;
    grid-template-rows: none;
`;

class Recorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderButtons() {
        var { recorderState, sendCommand } = this.props;
        switch (recorderState) {
            case 'paused':
                return (
                    <div>
                        <IconButton icon="play" onClick={() => sendCommand('resume')} />
                        <IconButton icon="stop" onClick={() => sendCommand('stop')}>
                            Stop Recording
                        </IconButton>
                    </div>
                );
            case 'inactive':
            case 'stopped':
                return (
                    <IconButton icon="microphone" onClick={() => sendCommand('start')}>
                        Start Recording
                    </IconButton>
                );
            case 'recording':
                return (
                    <div>
                        <IconButton icon="pause" onClick={() => sendCommand('pause')} />
                        <IconButton icon="stop" onClick={() => sendCommand('stop')}>
                            Stop Recording
                        </IconButton>
                    </div>
                );
            default:
                return;
        }
    }

    render() {
        return (
            <div>
                <h2>Recording Tools</h2>
                {this.renderButtons()}
                <AutoGrid cols={1} id="assets" />
                <IconButton icon="" onClick={() => this.props.sendCommand('upload-audio')}>
                    Generate Audio
                </IconButton>
            </div>
        );
    }
}

export default Recorder;

Recorder.propTypes = {
    recorderState: PropTypes.string,
    sendCommand: PropTypes.func,
};
