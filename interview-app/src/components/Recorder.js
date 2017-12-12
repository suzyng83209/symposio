import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text } from './styled-components/Texts';
import { GridWrapper } from './styled-components/Misc';
import { IconButton, LoadingButton } from './styled-components/Buttons';

const AutoGrid = GridWrapper.extend`
    grid-auto-rows: 32px;
    grid-template-rows: none;
    grid-template-columns: 72px 1fr 72px;
    box-sizing: border-box;
    padding: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.5);
    height: 50%;
    margin: 10% 0;
    @media screen and (max-height: 600px) {
        margin: 16px 0;
    }
    @media screen and (max-height: 480px) {
        margin: 0;
    }
`;

const RecorderContainer = styled.div`
    height: 100%;
    overflow-y: scroll;
    display: ${props => (props.active ? 'initial' : 'none')};
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
        const { active, isGeneratingAudio, sendCommand } = this.props;
        return (
            <RecorderContainer active={active}>
                <h2>Recording Tools</h2>
                {this.renderButtons()}
                <AutoGrid gutter={4} id="assets">
                    <div style={{ gridColumn: '1 / 4' }}>Audio assets will appear here.</div>
                </AutoGrid>
                <LoadingButton
                    icon="refresh"
                    loading={isGeneratingAudio}
                    onClick={() => sendCommand('upload-audio')}
                >
                    Generate Audio
                </LoadingButton>
            </RecorderContainer>
        );
    }
}

export default Recorder;

Recorder.propTypes = {
    isGeneratingAudio: PropTypes.bool,
    recorderState: PropTypes.string,
    sendCommand: PropTypes.func,
};
