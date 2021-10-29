import React from 'react';
import './App.css';

import MessageRouter from './components/MessageRouter';
import Header from './components/header';
import WorldMap from './components/WorldMap';
import PlayerInfo from './components/PlayerInfo';

export const App = () => {

  const height = 20
  const width = 30
  
  return (
      <MessageRouter>
        <div>
          <Header />
          <div className="game">
              <div className="game-info">
                  <div>
                      <h4>Rules</h4>
                      <p>How about some rules here?</p>
                  </div>
              </div>
              <WorldMap height={height} width={width}/>
              <PlayerInfo/>
          </div>
        </div>
      </MessageRouter>
  );
}

export default App;
