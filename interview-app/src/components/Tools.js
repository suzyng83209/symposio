import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, IconButton } from './Buttons';
import { ToolsContainer, MessageContainer } from './Containers';
import Messenger from './Messenger';
import { GridWrapper } from './Misc';

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
            this.portal
        );
    }
}

class Tools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            current: 'messages'
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

    renderSection() {
        var sections = {
            'recording-tools': (
                <div>
                    {this.renderButtons()}
                    <IconButton icon="" onClick={() => this.props.sendCommand('send-audio')}>
                        Generate Audio
                    </IconButton>
                    <GridWrapper rows={1} cols={3}>
                        <div id="local_assets" style={{ gridRow: '1', gridColumn: '1' }} />
                        <div id="remote_assets" style={{ gridRow: '1', gridColumn: '2' }} />
                        <div id="combined_assets" style={{ gridRow: '1', gridColumn: '3' }} />
                    </GridWrapper>
                </div>
            ),
            messages: (
                <Messenger onCommand={this.props.receiveCommand} onData={this.props.receiveData} />
            )
        };

        return sections[this.state.current || 'messages'];
    }

    renderButtons() {
        var { recorderState, sendCommand } = this.props;
        switch (recorderState) {
            case 'paused':
                return (
                    <div>
                        <IconButton icon="play" onClick={() => sendCommand('resume')} />
                        <IconButton icon="stop" onClick={() => sendCommand('stop')}>
                            Stop Recording
                        </IconButton>
                    </div>
                );
            case 'inactive':
            case 'stopped':
                return (
                    <IconButton icon="microphone" onClick={() => sendCommand('start')}>
                        Start Recording
                    </IconButton>
                );
            case 'recording':
                return (
                    <div>
                        <IconButton icon="pause" onClick={() => sendCommand('pause')} />
                        <IconButton icon="stop" onClick={() => sendCommand('stop')}>
                            Stop Recording
                        </IconButton>
                    </div>
                );
            default:
                return;
        }
    }

    render() {
        return (
            <ToolsContainer open={this.state.open}>
                <Toolbar>{this.renderTabs()}</Toolbar>
                <SectionWrapper>{this.renderSection()}</SectionWrapper>
            </ToolsContainer>
        );
    }
}

export default Tools;

Tools.propTypes = {
    receiveData: PropTypes.func,
    receiveCommand: PropTypes.func,
    sendCommand: PropTypes.func,
    isInterviewer: PropTypes.bool,
    recorderState: PropTypes.string
};

Tools.defaultProps = {
    receiveData: () => {},
    receiveCommand: () => {},
    sendCommand: () => {},
    recorderState: 'inactive'
};
