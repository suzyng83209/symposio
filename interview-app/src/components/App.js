import React, { Component } from 'react';
import RoomCreator from './RoomCreator';
import RoomValidator from './RoomValidator';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Route path="/room" component={RoomValidator} />
                    <Route exact path="/" component={RoomCreator} />
                </div>
            </Router>
        );
    }
}

export default App;
