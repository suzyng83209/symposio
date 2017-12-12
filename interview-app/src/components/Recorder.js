import React from 'react';
import PropTypes from 'prop-types';
import { Text } from './styled-components/Texts';
import { IconButton } from './styled-components/Buttons';
import { GridWrapper } from './styled-components/Misc';

const SubGrid = GridWrapper.extend`
    grid-row: ${props => props.row || '1'};
    grid-column: ${props => props.col || '1'};
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
                <GridWrapper rows={1} cols={4}>
                    <SubGrid id="local_assets" cols={1} />
                    <SubGrid id="remote_assets" col={2} cols={1} />
                    <SubGrid id="combined_assets" col={3} cols={1} />
                    <SubGrid id="transcripts" col={4} cols={1} />
                </GridWrapper>
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
