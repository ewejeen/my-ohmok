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
            <span></span>
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
    for(let i=0;i<10;i++){
        const col = [];
        for(let j=0;j<10;j++){
            col.push(this.renderSquare((10 * i) + j));
            
            key++;
        }
        row.push(<div className="board-row" key={key}>{col}</div>)
    }

    return (
      <div style={{height:'100%'}}>{row}</div>
    );
  }
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
                squares: Array(100).fill(null),
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

        if(calculateWinner(squares, this.state.xIsNext ? 'Black' : 'White', i) || squares[i]){
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
            isFinished: history.length === 100 ? 'Y' : 'N',
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
        let row=1, col=1;
        /*if(sel < 5) row = 0;
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
        }*/

        return [row, col];
    }
    
    render() {
        document.title = '오목하기';

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares, this.state.xIsNext ? 'Black' : 'White', this.state.selectedSquare ? 'Black' : 'White') ? calculateWinner(current.squares, this.state.xIsNext ? 'Black' : 'White', this.state.selectedSquare).winner : null;
        const winLines = calculateWinner(current.squares, this.state.xIsNext ? 'Black' : 'White', this.state.selectedSquare ? 'Black' : 'White') ? calculateWinner(current.squares, this.state.xIsNext ? 'Black' : 'White', this.state.selectedSquare).lines : null;
        
        const moves = history.map((step, move) => {
            const selSquare = step.selectedSquare;
            const rowNum = this.getRowAndColNum(selSquare)[0];
            const colNum = this.getRowAndColNum(selSquare)[1];

            const desc = step.turn ?
                move + '. Go to move #' + step.turn + " (" + rowNum + "," + colNum + ")" : '0. Go to game start';
           
            return (
                <li key={move}>
                    <Button style={{fontWeight : this.state.selected === move ? 'bold' : 'normal', color : move ? 'black' : 'blue'}} 
                            onClick={() => {this.jumpTo(move)}}>{desc}</Button>
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


// 우승 조건 계산
function calculateWinner(squares, xIsNext, selectedSquare) {
    const widthCnt = parseInt(Math.sqrt(squares.length));

    // 우승조건 lines
    const lines = [];

    // 배열이 배열을 포함하는지 여부
    const includesArray = (data, arr) => {
        return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
    }

    // lines 계산
    for(let i = 0; i < widthCnt; i++){
        for(let j = 0; j < widthCnt; j++){
            const sqNumber = i * widthCnt + j;

            // 가로
            if((j + (widthCnt * i) + 4) <= widthCnt * (i + 1) - 1){
                let winObj = [sqNumber, (sqNumber + 1), (sqNumber + 2), (sqNumber + 3), (sqNumber + 4)];
                if(!includesArray(lines, winObj)) lines.push(winObj);
            }
            
            // 세로
            if((sqNumber + (widthCnt * 4)) < squares.length){
                let winObj = [sqNumber, (sqNumber + widthCnt), (sqNumber + (widthCnt * 2)), (sqNumber + (widthCnt * 3)), (sqNumber + (widthCnt * 4))];
                if(!includesArray(lines, winObj)) lines.push(winObj);
            }
                    
            // 대각선 우하향
            if((sqNumber + (widthCnt * 4) + 4) < squares.length && i <= (widthCnt / 2) && j <= (widthCnt / 2)){
                let winObj = [sqNumber, (sqNumber + widthCnt + 1), (sqNumber + (widthCnt * 2) + 2), (sqNumber + (widthCnt * 3) + 3), (sqNumber + (widthCnt * 4) + 4)];
                if(!includesArray(lines, winObj)) lines.push(winObj);
            }

            // 대각선 좌하향
            if((sqNumber + (widthCnt * 4) - 4) <= (squares.length - widthCnt) && i <= (widthCnt / 2) && j >= (widthCnt / 2 - 1)){
                let winObj = [sqNumber, (sqNumber + widthCnt - 1), (sqNumber + (widthCnt * 2) - 2), (sqNumber + (widthCnt * 3) - 3), (sqNumber + (widthCnt * 4) - 4)];
                if(!includesArray(lines, winObj)) lines.push(winObj);
            }
        }
    }
    
    // 우승 조건 계산해서 return
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        return {lines: lines[i], winner: squares[a]};
      }
    }

    return null;
  }

  export default Game;