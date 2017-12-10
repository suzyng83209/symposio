import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Countdown, FlexWrapper } from './Misc';

const Overlay = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    padding: 1em;
    box-sizing: border-box;
    position: absolute;
    z-index: 100;
    color: white;
    font-size: 1.75em;
    pointer-events: none;
    align-items: flex-end;
`;

const State = styled.span`
    color: ${props => props.color || 'white'};
`;

const VideoOverlay = ({ recorderState, countdown }) => {
    if (countdown) return <Countdown count={countdown} />;
    return (
        <Overlay horizontal>
            Recorder is&nbsp;<State color="red">{recorderState}</State>
        </Overlay>
    );
};

export default VideoOverlay;

VideoOverlay.propTypes = {
    recorderState: PropTypes.string,
    countdown: PropTypes.number,
};
