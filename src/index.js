import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        value={props.squares[i]}
        onClick={()=>props.onClick(i)}
      />
    );
  }
  
  let squares = [];
  const div = [];
  for (let i=0; i<9; i+=3) {
    squares = [];
    for (let j=0; j<3; j++) {
      squares.push(renderSquare(i+j));
    }
    div.push(<div className = "board-row" key={i}>{squares}</div>)
  }

  return (
    <div>
      {div}
    </div>
  );
}

const Game = () => {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), locate: null}]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ?
      "Go to move #" + move + " " + step.locate:
      "Go to game start";
    return (
      <li key={move}>
        {stepNumber === move ? <button style = {{fontWeight: 700}} onClick = {()=>jumpTo(move)}>{desc}</button>:
        <button onClick = {()=>jumpTo(move)}>{desc}</button>}
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext? "X":"O");
  }
  
  const handleClick = (i) => {
    const newhistory = history.slice(0, stepNumber+1);
    const squares = current.squares.slice();
    if (winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext? "X":"O";
    let loc;
    if (i === 0) {
      loc = "(1, 1)";
    }else if (i === 1) {
      loc = "(2, 1)";
    }else if (i === 2) {
      loc = "(3, 1)";
    }else if (i === 3) {
      loc = "(1, 2)";
    }else if (i === 4) {
      loc = "(2, 2)";
    }else if (i === 5) {
      loc = "(3, 2)";
    }else if (i === 6) {
      loc = "(1, 3)";
    }else if (i === 7) {
      loc = "(2, 3)";
    }else {
      loc = "(3, 3)";
    }

    setHistory(newhistory.concat([{squares: squares, locate: loc}]));
    setStepNumber(newhistory.length);
    setXIsNext(!xIsNext);
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step%2)===0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i)=>handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
  
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

const calculateWinner = (squares)=>{
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