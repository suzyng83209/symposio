import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToolsContainer, MessageContainer } from './styled-components/Containers';
import Icon from './styled-components/Icons';
import Messenger from './Messenger';
import Recorder from './Recorder';

const ToolbarWrapper = styled.div`
    position: absolute;
    margin: 6em 1.5em 4em;
    z-index: 5;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: transparent;
    color: white;
`;

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 64px 96px 32px 32px;
    height: 100%;
`;

const TabWrapper = styled.div`
    width: 64px;
    height: 64px;
    margin: 8px 0;
    font-size: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0${props => (props.active ? '' : '.3')});
    background: ${props => (props.active && props.open ? 'transparent' : '#54c6fd')};
    border-radius: 50%;
    cursor: pointer;
    &:hover,
    &:active {
        box-shadow: none;
        background: ${props => (props.active && props.open ? 'transparent' : '#3e95bf')};
    }
`;

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.portal = document.getElementById('media-parent');
    }

    render() {
        if (!this.portal) return null;
        return ReactDOM.createPortal(
            <ToolbarWrapper>{this.props.children}</ToolbarWrapper>,
            this.portal,
        );
    }
}

class Tools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            current: 'messages',
        };
    }

    renderTabs() {
        const { current, open } = this.state;
        var tabs = [{ tab: 'messages', icon: 'comments-o' }];

        if (this.props.isInterviewer) {
            tabs.push({ tab: 'recording-tools', icon: 'microphone' });
        }

        const onClick = tab => {
            var newState = { current: tab, open: true };
            if (current === tab && open) {
                newState.open = false;
            }
            this.setState(newState);
        };

        return tabs.map(({ tab, icon }) => (
            <TabWrapper key={tab} open={open} active={current === tab} onClick={() => onClick(tab)}>
                <Icon icon={icon} />
            </TabWrapper>
        ));
    }

    render() {
        const {
            sendCommand,
            recorderState,
            receiveCommand,
            receiveData,
            isGeneratingAudio,
        } = this.props;
        return (
            <ToolsContainer id="tools" open={this.state.open}>
                <Toolbar>{this.renderTabs()}</Toolbar>
                <SectionWrapper>
                    <Recorder
                        sendCommand={sendCommand}
                        recorderState={recorderState}
                        isGeneratingAudio={isGeneratingAudio}
                        active={this.state.current === 'recording-tools'}
                    />
                    <Messenger
                        active={this.state.current === 'messages'}
                        onCommand={receiveCommand}
                        onData={receiveData}
                    />
                </SectionWrapper>
            </ToolsContainer>
        );
    }
}

export default Tools;

Tools.propTypes = {
    receiveCommand: PropTypes.func,
    receiveData: PropTypes.func,
    sendCommand: PropTypes.func,
    isInterviewer: PropTypes.bool,
    isGeneratingAudio: PropTypes.bool,
    recorderState: PropTypes.string,
};

Tools.defaultProps = {
    receiveData: () => {},
    receiveCommand: () => {},
    sendCommand: () => {},
    recorderState: 'inactive',
};
