import React from 'react';
import { InviteModal } from './modals';

const ModalDispatcher = props => {
    switch (props.currentModal) {
        case 'INVITE':
            return <InviteModal {...props} />;

        default:
            return null;
    }
};

export default ModalDispatcher;
