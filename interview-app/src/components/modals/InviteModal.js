import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ModalWrapper from './ModalWrapper';
import Icon from '../styled-components/Icons';
import { FlexWrapper } from '../styled-components/Misc';
import { Input } from '../styled-components/Inputs';
import { IconButton } from '../styled-components/Buttons';
import { withRouter } from 'react-router';

const ModalBody = FlexWrapper.extend`
    padding: 1em;
    padding-bottom: 2em;
    box-sizing: border-box;
    justify-content: space-around;
`;

class InviteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            copyText: 'Copy',
            copyIcon: 'clipboard',
            inviteLink: process.env.REACT_APP_FRONTEND_URL + '/room?roomId=' + props.roomId,
        };
    }

    handleInputChange = e => {
        this.setState({ email: e.target.value.trim().replace(/(,|;)/g, '') });
    };

    copyLink = () => {
        try {
            this.inviteLink.select();
            document.execCommand('copy');
        } catch (err) {
            console.log(err);
        }
        this.setState({ copyIcon: 'check', copyText: 'Copied' });
    };

    inviteGuest = () => {
        axios.post('/api/email/send', { data: this.state.email }).then(console.log);
    };

    render() {
        const { inviteLink, copyIcon, copyText } = this.state;
        return (
            <ModalWrapper {...this.props} title="Invite Your Guest" showOk={false} width={'480px'}>
                <ModalBody>
                    <FlexWrapper horizontal>
                        <div style={{ width: '75%' }}>
                            <Input
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div style={{ width: '25%' }}>
                            <IconButton icon="envelope" onClick={this.inviteGuest}>
                                Invite
                            </IconButton>
                        </div>
                    </FlexWrapper>
                    <FlexWrapper horizontal>
                        <div style={{ width: '75%' }}>
                            <Input
                                readOnly
                                value={inviteLink}
                                onClick={this.copyLink}
                                innerRef={r => (this.inviteLink = r)}
                            />
                        </div>
                        <div style={{ width: '25%' }}>
                            <IconButton icon={copyIcon} onClick={this.copyLink}>
                                {copyText}
                            </IconButton>
                        </div>
                    </FlexWrapper>
                </ModalBody>
            </ModalWrapper>
        );
    }
}

export default withRouter(InviteModal);
