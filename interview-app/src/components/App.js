import React, { Component } from 'react';
import RoomCreator from './RoomCreator';
import RoomValidator from './RoomValidator';
import ModalDispatcher from './ModalDispatcher';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentModal: null,
        };
    }

    dispatchModal = (modal, props) => {
        this.setState({ currentModal: modal, modalProps: props });
    };

    render() {
        return (
            <Router>
                <div id="main" className="App">
                    <Route path="/room" component={RoomValidator} />
                    <Route
                        exact
                        path="/"
                        render={() => <RoomCreator dispatchModal={this.dispatchModal} />}
                    />
                    <ModalDispatcher
                        {...this.state.modalProps}
                        currentModal={this.state.currentModal}
                        hideModal={() => this.setState({ currentModal: null })}
                    />
                </div>
            </Router>
        );
    }
}

export default App;
