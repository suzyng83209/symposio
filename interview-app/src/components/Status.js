import React from 'react';
import styled from 'styled-components';
import { Icon } from './Buttons';

const getColour = status => {
    switch (status) {
        case 'available':
        case 'valid':
        case 'ok':
            return '23DC3D';
        case 'unavailable':
        case 'not available':
        case 'invalid':
        case 'not valid':
        case 'error':
            return 'DC143C';
        default:
            return '232323';
    }
};

const getIcon = status => {
    switch (status) {
        case 'available':
        case 'valid':
        case 'ok':
            return 'check';
        case 'unavailable':
        case 'not available':
        case 'invalid':
        case 'not valid':
        case 'error':
            return 'times';
        default:
            return '';
    }
};

export const StatusText = styled.div`
    display: flex;
    white-space: nowrap;
    text-transform: capitalize;
    color: ${props => `#${getColour(props.status)}`};
`;

export const StatusTextIcon = ({ status }) => (
    <StatusText status={status}>
        <Icon icon={getIcon(status)} />
        &nbsp;
        {status}
    </StatusText>
);
