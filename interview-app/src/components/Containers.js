import React from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.div`
    background: black;
    height: 100%;
    width: 100%;
    video {
        position: absolute;
        width: 160px;
        border: 4px solid white;
        border-radius: 4px;
        top: ${props => props.x || '4em'};
        left: ${props => props.y || '0'};
        cursor: move;
        &:last-child {
            position: static;
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0;
            cursor: default;
        }
    }
`;

const MessageWrapper = styled.div`
    width: 100%;
    grid-column: 1;
    grid-row: 1 / 5;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

export const VideoContainer = props => <VideoWrapper id="video-container" {...props} />;

export const MessageContainer = props => <MessageWrapper id="message-container" {...props} />;

export const ToolsContainer = styled.div`
    width: 50%;
    height: 100%;
    color: white;
    background: #002a3e;
    display: ${props => (props.open ? 'initial' : 'none')};
`;
