import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

  function Square(props){
      return (
        <button 
            className="square" 
            onClick={props.onClick} //onClick=tell React to set up a click event listener
        >
          {props.value}
        </button>
      );
    /* To display the current state's value */
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
      <Square 
        value={this.props.squares[i]} 
        onClick = {()=>this.props.onClick(i)}
      />
      );
      //Each Square will now receive a value prop that will either be 'X', 'O', or null for empty squares.
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  } 
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history:[{
                squares:Array(9).fill(null),
            }],
            stepNumber:0,
            xIsNext:true, //First move is X by default 
        };
    }
    /*Constructor added to set the Board’s initial state 
    to contain an array of 9 nulls corresponding to the 9 squares
    history = to get every past version of the squares array*/

    handleClick(i){ //click on the board
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //= create copy of the squares array
        if (calculateWinner(squares) || squares[i]){
            return;
        } // if a player win, cannot click on the board anymore
        squares[i] = this.state.xIsNext ? 'X':'O'; 
        this.setState({
            history:history.concat([{squares:squares,
            }]),
            stepNumber:history.length,
            xIsNext:!this.state.xIsNext, //X and O take turns to play
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move) => {
            const desc = move ?
            'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}> {desc} </button>
                </li>
            ) 
            /*for each move, we create a list item which contains a button,
            that button has a onClick handler which calls this.JumpTo() method*/
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)}    
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }


  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);

  function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i=0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
  } //to check the winner and return the winner
  