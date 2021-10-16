import React, { Component } from 'react';
import './App.css';

import WorldMap from './components/WorldMap';

class App extends Component {

  state = {
    height: 20,
    width: 30,
  };

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

              <WorldMap height={height} width={width} />
              
          </div>
      );
  }
}

export default App;
