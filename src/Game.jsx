import React from 'react';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      scores: { X: 0, O: 0 },
      isPlayingWithAI: false // Default to not playing with AI
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }, () => {
      if (this.state.isPlayingWithAI && !this.state.xIsNext && !calculateWinner(squares)) {
        this.makeAIMove();
      }
    });
  }

  makeAIMove() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    // Find all empty squares
    const emptySquares = [];
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        emptySquares.push(i);
      }
    }

    // Choose a random empty square for the AI's move
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    squares[randomIndex] = 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: true,
    });
  }

  resetGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    });
  }

  toggleAIMode() {
    this.setState((prevState) => ({
      isPlayingWithAI: !prevState.isPlayingWithAI,
      // Reset the game whenever the mode is changed
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    if (winner && prevState.stepNumber !== this.state.stepNumber) {
      this.setState((state) => ({
        scores: {
          ...state.scores,
          [winner]: state.scores[winner] + 1
        }
      }));
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!current.squares.includes(null)) {
      status = "It's a draw!";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="reset-button" onClick={() => this.resetGame()}>Reset Game</button>
          <button className="toggle-ai-button" onClick={() => this.toggleAIMode()}>
            {this.state.isPlayingWithAI ? 'Play Without AI' : 'Play With AI'}
          </button>
          <div className="scoreboard">
            <div>Scoreboard</div>
            <div>X: {this.state.scores.X}</div>
            <div>O: {this.state.scores.O}</div>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
