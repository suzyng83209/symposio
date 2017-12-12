import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { MessageContainer } from './styled-components/Containers';
import { GridWrapper } from './styled-components/Misc';
import { MultiInput } from './styled-components/Inputs';
import Icon from './styled-components/Icons';
import RTCController from '../controllers/RTCController';

const InputContainer = styled.div`
    grid-row: 5;
    grid-column: 1;
    overflow: hidden;
    border-radius: 16px;
    border-top-right-radius: 0;
`;

const Message = styled.div`
    border-radius: 16px;
    border-top-${props => (props.type === 'local' ? 'right' : 'left')}-radius: 0;
    background: ${props => (props.type === 'local' ? '#eee' : '#54c6fd')};
    box-sizing: border-box;
    width: fit-content;
    max-width: 75%;
    min-width: 32px;
    padding: 0.5em;
    color: #002a3e;
    text-align: left;
    white-space: pre-line;
`;

const MessageGroup = styled.div`
    width: 100%;
    display: flex;
    margin-top: 8px;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row${props => (props.type === 'local' ? '' : '-reverse')};
    color: rgba(255, 255, 255, 0.25);
    small {
        transition: all 200ms;
        margin: 0 16px;
        opacity: 0;
    }
    &:hover {
        small {
            opacity: 1;
        }
    }
`;

class Messenger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.previousMessages || [],
            currentMessage: '',
            loading: true,
        };
    }

    componentDidMount() {
        RTCController.initialize().then(() => {
            RTCController.handleMessage(this.onMessage);
            this.setState({ loading: false });
        });
    }

    componentWillUnmount() {
        this.props.sustainMessages(this.state.messages);
    }

    handleInputChange = e => {
        this.setState({ currentMessage: e.target.value.replace(/\n$/, '') }); // removes last entry
    };

    sendMessage = () => {
        const { currentMessage } = this.state;
        if (currentMessage) {
            RTCController.sendMessage(currentMessage);
            this.updateMessages({ time: moment(), type: 'local', text: currentMessage });
            this.setState({ currentMessage: '' });
        }
    };

    updateMessages = newMessage => {
        const { messages } = this.state;
        var message = newMessage,
            index = messages.length;
        const { type, time, text } = messages[index - 1] || {};

        if (type === newMessage.type && moment(time).isSame(newMessage.time, 'minute')) {
            message = { ...newMessage, text: text + '\n' + newMessage.text };
            index--;
        }

        this.setState({ messages: [...messages.slice(0, index), message] });
    };

    onMessage = e => {
        switch (e.data.type) {
            case 'command':
                return this.props.onCommand(e);
            case 'data':
                return this.props.onData(e);
            default:
                return this.updateMessages(e.data);
        }
    };

    onKeyPress = e => {
        if (e.key !== 'Enter') return;
        if (e.shiftKey)
            return this.setState(prevState => ({
                currentMessage: prevState.currentMessage.concat('\n'),
            }));
        return this.sendMessage();
    };

    render() {
        const sendIcon = <Icon icon="caret-right" onClick={this.sendMessage} />;
        return (
            <GridWrapper rows={5} cols={1} gutter={16}>
                <MessageContainer>
                    {this.state.messages.map((message, i) => (
                        <MessageGroup type={message.type} key={i}>
                            <small>{moment(message.time).format('h:mm a')}</small>
                            <Message type={message.type}>{message.text}</Message>
                        </MessageGroup>
                    ))}
                </MessageContainer>
                <InputContainer>
                    <MultiInput
                        suffix={sendIcon}
                        placeholder="Type a message"
                        onKeyPress={this.onKeyPress}
                        onChange={this.handleInputChange}
                        value={this.state.currentMessage}
                    />
                </InputContainer>
            </GridWrapper>
        );
    }
}

export default Messenger;

Messenger.propType = {
    onCommand: PropTypes.func,
};
