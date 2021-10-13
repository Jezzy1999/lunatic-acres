import React, { Component } from 'react';
import './App.css';

import WorldMap from './components/WorldMap';

class App extends Component {

  state = {
    height: 8,
    width: 8,
  };

  handleGameStart = () => {
      let difficulty = document.querySelector("#mapsize_select");
      if (difficulty.value === "small") {
          this.setState({
              height: 8,
              width: 8,
          });
      }
      if (difficulty.value === "medium") {
          this.setState({
              height: 12,
              width: 12,
          });
      }
      if (difficulty.value === "large") {
          this.setState({
              height: 16,
              width: 16,
          });
      }
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
                  <h4>Select a level a click "start"</h4>
                  <span className="info">Map Size:
                      <select id="mapsize_select">
                          <option value="small"> Small </option>
                          <option value="medium"> Medium </option>
                          <option value="large"> Large </option>
                      </select>
                  </span>
                  <button onClick={this.handleGameStart}>Start</button>
              </div>

              <WorldMap height={height} width={width} />
              
          </div>
      );
  }
}

export default App;
