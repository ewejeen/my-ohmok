import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import Menu from './topMenu';
import './game.css';
import { useLocation } from 'react-router-dom';

// 각 사각형 렌더
function Square(props){
    return (
        <Button className={`${props.className['sq']} ${props.className['win']} w${props.level}` }
                onClick={props.onClick}
                style={props.squareStyle}>
            <span></span>
        </Button>
        
    );
}

// 사각형 포함하는 보드판 렌더
function Board(props){
    const renderSquare = (i) => {
        const winLines = props.winLines ? props.winLines : []; 

        return (
            <Square 
                value={props.squares[i]}
                className={{sq: props.squares[i] ? (props.squares[i] === 'Black' ? 'square activeB' : 'square activeW') : 'square', win: winLines.indexOf(i) > -1 ? 'win' : 'plain' }}
                onClick={()=>props.onClick(i)}
                level={props.level}
                key={i}
                
        />
        );
    }

    const location = useLocation();
    const level = location.state ? location.state.level : 5;
    
    const row = [];
    let key = 0;
    for(let i=0;i<level;i++){
        const col = [];
        for(let j=0;j<level;j++){
            col.push(renderSquare((level * i) + j));
            key++;
        }
        row.push(<div className={`board-row h${props.level}`} key={key}>{col}</div>)
    }

    return (
      <div style={{height:'100%'}}>{row}</div>
    );
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
function Game(props){
    const location = useLocation();
    const level = location.state ? location.state.level : 5; // 로그인 화면에서 선택한 레벨
    const squareSize = level ? parseInt(level) * parseInt(level) : 25;

    const [history, setHistory] = useState([{
        squares: Array(squareSize).fill(null),
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [selected, setSelected] = useState(null);
    const [isAscending, setIsAscending] = useState(true);
    const [isFinished, setIsFinished] = useState('N');

    const handleClick = (i) => {
        const sHistory = history.slice(0, stepNumber + 1);
        const current = sHistory[sHistory.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares, xIsNext ? 'Black' : 'White', i) || squares[i]){
            return ;
        }

        squares[i] = xIsNext ? 'Black' : 'White';
        
        setHistory(sHistory.concat([{
            squares: squares,
            selectedSquare: i,
            turn: sHistory.length,
        }]));
        setStepNumber(sHistory.length);
        setXIsNext(!xIsNext);
        setIsFinished(sHistory.length === squareSize ? 'Y' : 'N');
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step%2) === 0);
        setSelected(step);
    }

    const restart = (squareSize) => {
        setHistory([{
            squares: Array(squareSize).fill(null),
        }]);
        setStepNumber(0);
        setXIsNext(true);
        setSelected(null);
        setIsAscending(true);
        setIsFinished('N');
    }

    const changeOrder = () => {
        setIsAscending(!isAscending);
    }

    const getRowAndColNum = (sel) => {
        const row = parseInt(sel / level);
        const col = parseInt(sel % level);

        return [row, col];
    }
    
    
    document.title = '오목하기';

    //const history = this.state.history;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares, xIsNext ? 'Black' : 'White', current.selectedSquare ? 'Black' : 'White') ? calculateWinner(current.squares, xIsNext ? 'Black' : 'White', current.selectedSquare).winner : null;
    const winLines = calculateWinner(current.squares, xIsNext ? 'Black' : 'White', current.selectedSquare ? 'Black' : 'White') ? calculateWinner(current.squares, xIsNext ? 'Black' : 'White', current.selectedSquare).lines : null;
    
    const moves = history.map((step, move) => {
        const selSquare = step.selectedSquare;
        const rowNum = getRowAndColNum(selSquare)[0];
        const colNum = getRowAndColNum(selSquare)[1];

        const desc = step.turn ?
            move + '. Go to move #' + step.turn + " (" + rowNum + "," + colNum + ")" : '0. Go to game start';
        
        return (
            <li key={move}>
                <Button style={{fontWeight : selected === move ? 'bold' : 'normal', color : move ? 'black' : 'blue'}} 
                        onClick={() => {jumpTo(move)}}>{desc}</Button>
            </li>
        );
    });

    if(!isAscending){
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
                            onClick={(i) => handleClick(i)}
                            level={level}
                        />
                    </div>
                    <div className="game-info">
                        <StatusInfo xIsNext={xIsNext} isFinished={isFinished} winner={winner} />
                        
                        <div className="move-info">
                            <ol>{moves}</ol>
                        </div>
                        <div className="menu-info">
                            <Button className="menu-btn" onClick={() => changeOrder()}>{isAscending ? '▼ DESC (NOW: ASC)' : '▲ ASC (NOW: DESC)'}</Button>
                            <Button className="menu-btn" onClick={() => restart(current.squares.length)}>RESTART</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
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