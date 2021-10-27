  import React, { Component } from 'react';
  import { w3cwebsocket as W3CWebSocket } from "websocket";
import './App.css';

import Header from './components/header';
import WorldMap from './components/WorldMap';
import PlayerInfo from './components/PlayerInfo';

const client = new W3CWebSocket('ws://127.0.0.1:8080/ws');

class App extends Component {

  state = {
    height: 20,
    width: 30,
  };

  componentDidMount() {
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
          <div>
            <Header />
            <div className="game">
                <div className="game-info">
                    <div>
                        <h4>Rules</h4>
                        <p>How about some rules here?</p>
                    </div>
                </div>
                <WorldMap height={height} width={width} socket={client}/>
                <PlayerInfo socket={client}/>
            </div>
          </div>
      );
  }
}

export default App;
