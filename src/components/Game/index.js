import { useState, useMemo } from "react";
import "./index.css";

// 获胜的方式
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

// 子 Square 组件渲染了一个单独的 <button>
function Square({ value, onClick }) {
    return (
        // 获取按钮的点击事件和出现的值
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );
}

// 父 Board 组件渲染了 9 个方块。
function Board({ squares, onClick }) {
    const rowSquares = useMemo(() => {
        return [squares.slice(0, 3), squares.slice(3, 6), squares.slice(6)];
    }, [squares]);

    return (
        <div>
            {rowSquares.map((row, rowIdx) => (
                <div key={rowIdx} className="board-row">
                    {row.map((item, index) => {
                        const i = rowIdx * 3 + index;
                        const row = rowIdx + 1;
                        const col = index + 1;
                        return (
                            // 判断第几行第几个
                            <Square
                                key={index}
                                value={item}
                                onClick={() => onClick(i, row, col)}
                            ></Square>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

//我们在 Game 组件的 render 方法中调用 history 的 map 方法
function Move({ step, move, onClick }) {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
        <li style={{ textAlign: "left" }}>
            <button onClick={onClick}>{desc}</button>
            {step.row && (
                <>
                    <span style={{ margin: "0 10px" }}>last position: </span>
                    <span>
                        row {step.row},col {step.col}
                    </span>
                </>
            )}
        </li>
    );
}

// Game 组件渲染了含有默认值的一个棋盘
function Game() {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
        },
    ]);
    const [stepNumber, setStepNumber] = useState(history.length);
    const [xIsNext, setXIsNext] = useState(true);
    const squares = useMemo(() => {
        return history[stepNumber - 1].squares;
    }, [history, stepNumber]);

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    function handleClick(i, row, col) {
        console.log(i, row, col);
        const tempSquares = [...squares];
        if (tempSquares[i] || winner) {
            return;
        }

        tempSquares[i] = xIsNext ? "O" : "X";

        const tempHistory = [
            ...history,
            {
                squares: tempSquares,
                row,
                col,
            },
        ];

        setHistory(tempHistory);
        setStepNumber(tempHistory.length);
        setXIsNext(!xIsNext);
    }
    function jumpTo(index) {
        setStepNumber(index + 1);
        setXIsNext(index % 2 === 0);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={squares}
                    onClick={(i, row, col) => handleClick(i, row, col)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>
                    {history.map((item, index) => (
                        <Move
                            key={index}
                            step={item}
                            move={index}
                            onClick={() => jumpTo(index)}
                        ></Move>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default Game;