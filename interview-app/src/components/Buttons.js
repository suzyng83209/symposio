import React from 'react';
import styled from 'styled-components';

export const Button = styled.button`
    color: white;
    font-size: 1em;
    margin: 1em;
    width: fit-content;
    padding: 0.25em 1em;
    background: #54c6fd;
    border: 2px solid #54c6fd;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
    border-radius: 100px;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    outline: none !important;
    white-space: nowrap;
    &:hover,
    &:active {
        background: #3e95bf;
        border-color: #3e95bf;
    }
`;

export const InvertedButton = Button.extend`
    color: #54c6fd;
    background: white;
    &:hover,
    &:active {
        color: #3e95bf;
    }
`;

export const WideButton = Button.extend`width: 100%;`;

export const Icon = ({ icon }) => <i className={`fa fa-${icon}`} aria-hidden="true" />;

export const IconButton = ({ icon, onClick, disabled, children }) => (
    <Button onClick={onClick} disabled={disabled} >
        <Icon icon={icon} />
        {children && ' '}
        {children}
    </Button>
);

export const LoadingButton = ({ loading, icon, children, onClick }) => {
    const Icon = icon && <Icon icon={icon} />;
    const LoadingIcon = loading ? <Icon icon="spinner fa-pulse" /> : Icon;
    return (
        <Button disabled={loading} onClick={onClick}>
            {LoadingIcon}
            {children && ' '}
            {children}
        </Button>
    );
};
