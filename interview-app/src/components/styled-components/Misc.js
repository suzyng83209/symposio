import React from 'react';
import styled, { keyframes } from 'styled-components';

const zoomFade = keyframes`
    from {
        opacity: 0;
        font-size: 5em;
    }
    to {
        opacity: 1;
        font-size: 3em;
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
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

export const Countdown = ({ count, width }) => (
    <CountdownWrapper>{count}</CountdownWrapper>
);

export const FlexWrapper = styled.div`
    width: 100%;
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

export const Grid = styled.div`
    grid-row: ${props => props.row || '1'};
    grid-column: ${props => props.col || '1'};
`;

const ContentWrapper = styled.div`
    width: 100%;
    text-align: left;
`;

export const withLabel = label => component => (
    <ContentWrapper>
        <label>{label}</label>
        {component}
    </ContentWrapper>
);
