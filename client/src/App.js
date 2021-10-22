  import React, { Component } from 'react';
  import { w3cwebsocket as W3CWebSocket } from "websocket";
import './App.css';

import WorldMap from './components/WorldMap';

const client = new W3CWebSocket('ws://127.0.0.1:8080/ws');

class App extends Component {

  state = {
    height: 20,
    width: 30,
  };

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
  
  handleGameStart = () => {
  }

  render() {
      const { height, width } = this.state;
      return (
          <div className="game">
              <div className="game-info">
                  <div className="instructions">
                      <h4>Rules</h4>
                      <p>How about some rules here?</p>
                  </div>
              </div>

              <WorldMap height={height} width={width} socket={client}/>
              
          </div>
      );
  }
}

export default App;
