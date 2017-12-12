import React from 'react';
import styled from 'styled-components';

export const Text = styled.span`
    font-size: ${props => props.size || '1em'};
    color: ${props => props.color || 'white'};
`;
