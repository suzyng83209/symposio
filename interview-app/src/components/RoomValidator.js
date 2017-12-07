import React from 'react';
import { withParams } from '../utils/Utils';
import { VideoContainer } from './Containers';
import RoomControls from './RoomControls';
import RTCController from '../controllers/RTCController';
import { FlexWrapper } from './Misc';
import Tools from './Tools';
import Room from './Room';

class RoomValidator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: true
        };
    }

    componentDidMount() {
        const { roomId } = this.props.params;
        RTCController.initialize()
            .then(() => {
                if (!roomId) {
                    throw new Error('Missing Parameters: roomID');
                }
                return RTCController.checkRoom(roomId);
            })
            .then(roomExists => {
                if (!roomExists) {
                    throw new Error('Room does not exist');
                }
                if (RTCController.isRoomFull()) {
                    throw new Error('Room is full');
                }
                return RTCController.join(roomId);
            })
            .then(() => this.setState({ loading: false }))
            .catch(err => this.setState({ loading: false, error: err }));
    }

    render() {
        if (this.state.loading) return null;
        if (this.state.error)
            return (
                <div>
                    <h1>Error:</h1>
                    <h2>{this.state.error.message}</h2>
                </div>
            );
        return (
            <div style={{ height: '100vh' }}>
                <RoomControls isRoomOpened roomId={this.props.params.roomId} />
                <Room>
                    {({ recorderState, onCommandSend, onCommandReceived }) => (
                        <FlexWrapper horizontal>
                            <VideoContainer />
                            <Tools
                                recorderState={recorderState}
                                receiveCommand={onCommandReceived}
                            />
                        </FlexWrapper>
                    )}
                </Room>
            </div>
        );
    }
}

export default withParams(RoomValidator);
