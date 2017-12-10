import React from 'react';
import { IconButton, Button } from './Buttons';
import RoomControls from './RoomControls';
import RTCController from '../controllers/RTCController';
import { FlexWrapper } from './Misc';
import { VideoContainer } from './Containers';
import Tools from './Tools';
import Room from './Room';
import VideoOverlay from './VideoOverlay';

class RoomCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            roomId: null,
        };
    }

    componentDidMount() {
        RTCController.initialize().then(() => this.setState({ loading: false }));
    }

    onSelectRoomId = roomId => {
        this.setState({ roomId });
    };

    render() {
        if (this.state.loading) {
            return null;
        }
        const style = {
            height: this.state.roomId ? '100vh' : '',
        };
        return (
            <div style={style}>
                <RoomControls
                    onSelectRoomId={this.onSelectRoomId}
                    isRoomOpened={Boolean(this.state.roomId)}
                />
                {this.state.roomId && (
                    <Room isInterviewer>
                        {({
                            countdown,
                            recorderState,
                            onCommandSend,
                            onCommandReceived,
                            onDataReceived,
                        }) => (
                            <FlexWrapper horizontal id="media-parent">
                                <VideoContainer />
                                <VideoOverlay countdown={countdown} recorderState={recorderState} />
                                <Tools
                                    isInterviewer
                                    sendCommand={onCommandSend}
                                    receiveData={onDataReceived}
                                    recorderState={recorderState}
                                />
                            </FlexWrapper>
                        )}
                    </Room>
                )}
            </div>
        );
    }
}

export default RoomCreator;
