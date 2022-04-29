import React from 'react';
import { Box, Button } from '@material-ui/core';
import Menu from './topMenu';
import './game.css';
import { useLocation } from 'react-router-dom';

function Square(props){
    return (
        <Button className={`${props.className['sq']} ${props.className['win']}`}
                onClick={props.onClick}
                style={props.squareStyle}>
            <span>{props.value}</span>
        </Button>
        
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        const winLines = this.props.winLines ? this.props.winLines : []; 

        return (
            <Square 
                value={this.props.squares[i]}
                className={{sq: this.props.squares[i] ? (this.props.squares[i] === 'Black' ? 'square activeB' : 'square activeW') : 'square', win: winLines.indexOf(i) > -1 ? 'win' : 'plain' }}
                onClick={()=>this.props.onClick(i)}
                key={i}
                
        />
    );
  }

  render() {
    const row = [];
    let key = 0;
    for(let i=0;i<5;i++){
        const col = [];
        for(let j=0;j<5;j++){
            col.push(this.renderSquare((5 * i) + j));
            
            key++;
        }
        row.push(<div className="board-row" key={key}>{col}</div>)
    }

    return (
      <div>{row}</div>
    );
  }
}

// 매 단계 히스토리 버튼
const StepButtons = (props) => {
    return (
        <Button style={{fontWeight : props.selected === props.move ? 'bold' : 'normal', color : props.move ? 'black' : 'blue'}} 
                onClick={() => {this.jumpTo(props.move)}}>{props.desc}</Button>
    )
}

// 승자표시
const StatusInfo = (props) => {    
    const location = useLocation();
    const p1 = location.state ? location.state.player1 : 'Black';
    const p2 = location.state ? location.state.player2 : 'White';

    let status;
    if(props.winner){
        status = 'Winner: ' + (props.winner === 'Black' ? p1 : p2);
    } else{
        if(props.isFinished === 'Y'){
            status = 'DRAW';
        } else{
            status = 'Next player: ' + (props.xIsNext ? p1 : p2);
        }
    }

    return (
        <div className="status-info">{status}</div>
    );
}


// 게임 (최상위)
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(25).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            selected: null,
            isAscending: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return ;
        }
        squares[i] = this.state.xIsNext ? 'Black' : 'White';
        
        this.setState({
            history: history.concat([{
                squares: squares,
                selectedSquare: i,
                turn: history.length,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            isFinished: history.length === 25 ? 'Y' : 'N',
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
            selected : step
        });
    }

    changeOrder(){
        this.setState({
            isAscending: !this.state.isAscending,
        })
    }

    getRowAndColNum(sel){
        let row, col;
        if(sel < 5) row = 0;
        else if(sel < 10) row = 1;
        else if(sel < 15) row = 2;
        else if(sel < 20) row = 3;
        else if(sel < 25) row = 4;

        switch(sel % 5){
            case 0: col = 0; break;
            case 1: col = 1; break;
            case 2: col = 2; break;
            case 3: col = 3; break;
            case 4: col = 4; break;
            default: break;
        }

        return [row, col];
    }
    
    render() {
        document.title = '오목하기';

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winner : null;
        const winLines = calculateWinner(current.squares) ? calculateWinner(current.squares).lines : null;
        
        const moves = history.map((step, move) => {
            const selSquare = step.selectedSquare;
            const rowNum = this.getRowAndColNum(selSquare)[0];
            const colNum = this.getRowAndColNum(selSquare)[1];

            const desc = step.turn ?
                move + '. Go to move #' + step.turn + " (" + rowNum + "," + colNum + ")" : '0. Go to game start';
           
            return (
                <li key={move}>
                    <StepButtons desc={desc} move={move} selected={this.state.selected}/>
                </li>
            );
        });

        if(!this.state.isAscending){
            moves.reverse();
        }

        return (
            <>
            <Menu />
            <div className="wrap">
                <div className="game">
                    <Box className="game-title">
                        <h2>my-ohmok</h2>
                    </Box>
                    <div className="game-content">
                        <div className="game-board">
                            <Board 
                                squares={current.squares}
                                winLines={winLines}
                                onClick={(i) => this.handleClick(i)}
                            />
                        </div>
                        <div className="game-info">
                            <StatusInfo xIsNext={this.state.xIsNext} isFinished={this.state.isFinished} winner={winner} />
                            
                            <div className="move-info">
                                <ol>{moves}</ol>
                            </div>
                            <div className="menu-info">
                                <Button className="menu-btn" onClick={() => this.changeOrder()}>{this.state.isAscending ? '▼ DESC (NOW: ASC)' : '▲ ASC (NOW: DESC)'}</Button>
                                <Button className="menu-btn">RESTART</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

// ========================================

/*
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
*/

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        return {lines: lines[i], winner: squares[a]};
      }
    }
    return null;
  }

  export default Game;