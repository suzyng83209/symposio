import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'underscore';
import { Button, IconButton } from './styled-components/Buttons';
import { InputGroup } from './styled-components/Inputs';
import { StatusTextIcon } from './styled-components/Status';
import { isValidRoomId } from '../utils/Utils';
import RTCController from '../controllers/RTCController';

const DEBOUNCE_TIME = 300;

const GridWrapper = styled.div`
    display: grid;
    grid-template-rows: repeat(2, 64px);
    grid-gap: 8px;
    max-width: 640px;
    margin: auto;
`;

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    padding: 0 16px;
    background: linear-gradient(180deg, black, transparent);
`;

class RoomControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            roomId: props.roomId || '',
            isTyping: false,
        };
        this.checkRoomId = _.debounce(this.checkRoomId, DEBOUNCE_TIME);
    }

    componentDidMount() {
        RTCController.initialize();
    }

    handleInputChange = e => {
        this.setState({ roomId: e.target.value.replace(/\s+/g, '-'), isTyping: true });
        this.checkRoomId();
    };

    checkRoomId = () => {
        var { roomId } = this.state;
        this.setState({ isTyping: false });
        if (!roomId) {
            return this.setState({
                status: '',
            });
        }
        if (!isValidRoomId(roomId)) {
            return this.setState({
                status: 'not valid',
            });
        }
        return RTCController.checkRoom(roomId).then(doesRoomExist => {
            return this.setState({ status: `${doesRoomExist ? 'not ' : ''}available` });
        });
    };

    selectRoomId = () => {
        RTCController.open(this.state.roomId);
        this.props.onSelectRoomId(this.state.roomId);
    };

    closeRoom = () => {
        RTCController.close();
        this.props.onSelectRoomId();
        this.setState({ status: '', roomId: '' });
    };

    onKeyPress = e => {
        if (
            e.key === 'Enter' &&
            this.state.roomId &&
            !this.props.isRoomOpened &&
            this.state.status === 'available'
        )
            return this.selectRoomId();
        return;
    };

    renderButtons = () => {
        if (!this.state.roomId) return;
        if (this.props.isRoomOpened)
            return (
                <div>
                    <IconButton
                        icon="user-plus"
                        onClick={() =>
                            this.props.dispatchModal('INVITE', { roomId: this.state.roomId })
                        }
                    >
                        Invite
                    </IconButton>
                    <Button onClick={this.closeRoom}>Close Room</Button>
                </div>
            );
        return (
            <IconButton
                icon="video-camera"
                onClick={this.selectRoomId}
                disabled={this.state.status !== 'available'}
            >
                Open Room
            </IconButton>
        );
    };

    render() {
        var { isRoomOpened } = this.props;
        const RoomControlWrapper = isRoomOpened ? HeaderWrapper : GridWrapper;
        return (
            <RoomControlWrapper>
                <div style={{ gridRow: 1 }}>
                    <InputGroup
                        value={this.state.roomId.replace(/\-/g, ' ')}
                        onChange={this.handleInputChange}
                        onKeyPress={this.onKeyPress}
                        placeholder="Enter Room ID"
                        readOnly={isRoomOpened}
                        light={isRoomOpened}
                        suffix={
                            !isRoomOpened &&
                            !this.state.isTyping && <StatusTextIcon status={this.state.status} />
                        }
                    />
                </div>
                <div style={{ gridRow: 2 }}>{this.renderButtons()}</div>
            </RoomControlWrapper>
        );
    }
}

export default RoomControls;

RoomControls.propTypes = {
    onSelectRoomId: PropTypes.func,
    isRoomOpened: PropTypes.bool,
    isModerator: PropTypes.bool,
    roomId: PropTypes.string,
};

RoomControls.defaultProps = {
    onSelectRoomId: () => {},
};
