import React from 'react';
import styled, { keyframes } from 'styled-components';

const zoomFade = keyframes`
    from {
        opacity: 0;
        font-size: 4em;
    }
    to {
        opacity: 1;
        font-size: 2em;
    }
`;

const CountdownWrapper = styled.div`
    animation: ${zoomFade} 1s ease;
    animation-iteration-count: 3;
    position: absolute;
    z-index: 100;
    width: 100%;
    display: flex;
    justify-content: center;
    color: white;
    font-size: 4em;
`;

export const Countdown = ({ count, width }) => (
    <CountdownWrapper width={width}>{count}</CountdownWrapper>
);

export const FlexWrapper = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: ${props => (props.horizontal ? 'row' : 'column')};
`;

export const GridWrapper = styled.div`
    height: 100%;
    display: grid;
    grid-template-rows: repeat(${props => props.rows || 3}, 1fr);
    grid-template-columns: repeat(${props => props.cols || 3}, 1fr);
    grid-gap: ${props => props.gutter || '0'}px;
`;
