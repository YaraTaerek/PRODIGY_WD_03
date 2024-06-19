import React from 'react';
import './index.css';
import Game from './Game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Tic-Tac-Toe Game</h1>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
