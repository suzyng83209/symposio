import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import Icon from '../styled-components/Icons';
import { Text } from '../styled-components/Texts';

const fade = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const fadeSlide = keyframes`
    from {
        opacity: 0;
        transform: translateY(25%)
    }
    to {
        opacity: 1;
        transform: translateY(0%);
    }
`;

const Overlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${fade} 300ms ease;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 100;
    margin: auto;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
`;

const Modal = styled.div`
    animation: ${fadeSlide} 300ms ease;
    width: ${props => props.width || '50%'};
    height: ${props => props.height || '50%'};
    background: white;
    max-width: 600px;
    min-height: 360px;
    max-height: 600px;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 1em;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
`;

const ModalWrapper = props => {
    const handleOverlayClick = e => {
        if (e.target === e.currentTarget) props.hideModal();
    };

    const onOk = () => {
        props.onOk();
        props.hideModal();
    };

    const okButton = props.showOk ? (
        <button onClick={onOk} disabled={props.okDisabled}>
            {props.okText}
        </button>
    ) : null;

    return (
        <Overlay onClick={handleOverlayClick}>
            <Modal {...props}>
                <Header>
                    <Text size={'1.5em'} color={'#232323'}>
                        {props.title}
                    </Text>
                    <Icon icon="times" onClick={props.hideModal} />
                </Header>
                {props.children}
                {okButton}
            </Modal>
        </Overlay>
    );
};

ModalWrapper.propTypes = {
    title: PropTypes.string,
    width: PropTypes.string,
    okText: PropTypes.string,
    okDisabled: PropTypes.bool,
    showOk: PropTypes.bool,
    style: PropTypes.object,
    hideModal: PropTypes.func,
    onOk: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string])
        .isRequired,
};

ModalWrapper.defaultProps = {
    title: '',
    showOk: true,
    okText: 'OK',
    okDisabled: false,
    width: '400px',
    onOk: () => {},
};

export default ModalWrapper;
