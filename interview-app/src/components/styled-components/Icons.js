import React from 'react';
import styled from 'styled-components';

const Icon = styled.i`
    cursor: pointer;
`;

export default ({ icon, onClick }) => (
    <Icon className={`fa fa-${icon}`} aria-hidden="true" onClick={onClick} />
);
