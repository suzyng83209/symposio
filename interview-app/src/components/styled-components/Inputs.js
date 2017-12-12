import React from 'react';
import styled from 'styled-components';
import { FlexWrapper } from './Misc';

export const Input = styled.input`
    padding: 0.25em;
    font-size: 1em;
    background: transparent;
    width: -webkit-fill-available;
    border: none;
    color: ${props => (props.light ? 'white' : '#232323')};
    border-bottom: 2px solid rgba(${props => (props.light ? '255, 255, 255' : '0, 0, 0')}, 0.25);
    outline: none !important;
`;

const TextArea = styled.textarea`
    outline: none !important;
    resize: none;
    height: 100%;
    width: 100%;
    border: none;
    font-size: 1em;
    color: #002a3e;
    box-sizing: border-box;
    background: transparent;
`;

const Addon = styled.div`
    background: transparent;
    padding: 0.25em;
    border-bottom: 2px solid rgba(${props => (props.light ? '255, 255, 255' : '0, 0, 0')}, 0.25);
`;

const MultiAddon = Addon.extend`
    position: relative;
    border: none;
    height: 100%;
    color: #002a3e;
    font-size: 2em;
    padding: 0;
    top: -0.25em;
`;

const InputGroupWrapper = styled.div`
    display: flex;
    align-content: baseline;
`;

const MultiInputWrapper = FlexWrapper.extend`
    padding: 0.5em;
    box-sizing: border-box;
    background: #eee;
`;

export const InputGroup = props => (
    <InputGroupWrapper>
        <Addon light={props.light}>{props.prefix}</Addon>
        <Input {...props} />
        <Addon light={props.light}>{props.suffix}</Addon>
    </InputGroupWrapper>
);

export const MultiInput = props => (
    <MultiInputWrapper horizontal>
        <TextArea {...props} />
        <MultiAddon>{props.suffix}</MultiAddon>
    </MultiInputWrapper>
);
