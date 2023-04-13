import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Square from './Square';

class Game extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the game state
        this.state = {
            board: [
                [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }],
                [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
                [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }]
            ],
            currentPlayer: 'white'
        };

        // Bind event handlers
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
    }

    handleDragStart(event) {
        this.state.draggingPiece = event.currentTarget;
    }

    handleDragOver(event) {
        event.nativeEvent.preventDefault()
    }

    handleDragEnd(event) {
        const source = this.state.draggingPiece;
        const destination = event.currentTarget;

        source.droppableId = parseInt(source.dataset.rowindex, 10);
        source.index = parseInt(source.dataset.columnindex, 10);
        destination.droppableId = parseInt(destination.dataset.rowindex, 10);
        destination.index = parseInt(destination.dataset.columnindex, 10);

        // If the drag was cancelled, do nothing
        if (!destination) {
            return;
        }

        // Get the piece being moved
        const piece = this.state.board[source.droppableId][source.index];

        if (piece.color !== this.state.currentPlayer) {
            return;
        }

        // Check if the move is valid
        const validMoves = this.getValidMoves(source.droppableId, source.index);
        const isValidMove = validMoves?.some(move => move.row === destination.droppableId && move.col === destination.index) || false;

        if (!isValidMove) {
            // If the move is not valid, reset the board state and return
            this.setState({
                board: this.state.board,
            });
            return;
        }

        // Update the board state
        const newBoard = [...this.state.board];
        newBoard[source.droppableId][source.index] = {};
        newBoard[destination.droppableId][destination.index] = piece;
        piece.moves = (piece.moves || 0) + 1;
        this.setState({
            board: newBoard,
            currentPlayer: this.state.currentPlayer === 'white' ? 'black' : 'white'
        });
    }

    getValidMoves(row, col) {
        const piece = this.state.board[row][col];
        const validMoves = [];

        switch (piece.type) {
            case 'pawn':
                validMoves.push(...this.getPawnMoves(row, col));
                break;
            case 'rook':
                validMoves.push(...this.getRookMoves(row, col));
                break;
            case 'knight':
                validMoves.push(...this.getKnightMoves(row, col));
                break;
            case 'bishop':
                validMoves.push(...this.getBishopMoves(row, col));
                break;
            case 'queen':
                validMoves.push(...this.getQueenMoves(row, col));
                break;
            case 'king':
                validMoves.push(...this.getKingMoves(row, col));
                break;
            default:
                break;
        }

        return validMoves;
    }

    isEmptySquare(row, column) {
        const piece = this.state.board[row][column];
        return !piece?.type;
    }

    isOpponentPiece(row, column, currentPlayerColor) {
        const piece = this.state.board[row][column];
        return piece?.type && piece.color !== currentPlayerColor;
    }

    getPawnMoves(row, col) {
        const piece = this.state.board[row][col];
        const direction = piece.color === 'white' ? 1 : -1;
        const validMoves = [];

        // Check if the pawn can move one or two squares forward
        const forward1 = { row: row + direction, col };
        const forward2 = { row: row + (2 * direction), col };

        if (this.isEmptySquare(forward1.row, forward1.col)) {
            validMoves.push(forward1);
        }

        if (!piece.moves && this.isEmptySquare(forward1.row, forward1.col) && this.isEmptySquare(forward2.row, forward2.col)) {
            validMoves.push(forward2);
        }

        // Check if the pawn can capture diagonally
        const diagonal1 = { row: row + direction, col: col - 1 };
        const diagonal2 = { row: row + direction, col: col + 1 };

        if (this.isOpponentPiece(diagonal1.row, diagonal1.col, piece.color)) {
            validMoves.push(diagonal1);
        }

        if (this.isOpponentPiece(diagonal2.row, diagonal2.col, piece.color)) {
            validMoves.push(diagonal2);
        }

        return validMoves;
    }

    getRookMoves(row, col) {
        const piece = this.state.board[row][col];
        const validMoves = [];

        // Check moves to the right
        for (let i = col + 1; i < 8; i++) {
            if (this.isEmptySquare(row, i)) {
                validMoves.push({ row, col: i });
            } else if (this.isOpponentPiece(row, i, piece.color)) {
                validMoves.push({ row, col: i });
                break;
            } else {
                break;
            }
        }

        // Check moves to the left
        for (let i = col - 1; i >= 0; i--) {
            if (this.isEmptySquare(row, i)) {
                validMoves.push({ row, col: i });
            } else if (this.isOpponentPiece(row, i, piece.color)) {
                validMoves.push({ row, col: i });
                break;
            } else {
                break;
            }
        }

        // Check moves upwards
        for (let i = row - 1; i >= 0; i--) {
            if (this.isEmptySquare(i, col)) {
                validMoves.push({ row: i, col });
            } else if (this.isOpponentPiece(i, col, piece.color)) {
                validMoves.push({
                    row: i,
                    col
                });
                break;
            } else {
                break;
            }
        }

        // Check moves downwards
        for (let i = row + 1; i < 8; i++) {
            if (this.isEmptySquare(i, col)) {
                validMoves.push({ row: i, col });
            } else if (this.isOpponentPiece(i, col, piece.color)) {
                validMoves.push({ row: i, col });
                break;
            } else {
                break;
            }
        }

        return validMoves;
    }

    getKnightMoves(row, col) {
        const piece = this.state.board[row][col];
        const validMoves = [];

        const moves = [
            { row: row - 2, col: col - 1 },
            { row: row - 2, col: col + 1 },
            { row: row - 1, col: col - 2 },
            { row: row - 1, col: col + 2 },
            { row: row + 1, col: col - 2 },
            { row: row + 1, col: col + 2 },
            { row: row + 2, col: col - 1 },
            { row: row + 2, col: col + 1 },
        ];

        moves.forEach((move) => {
            if (this.isInsideBoard(move.row, move.col) && (this.isEmptySquare(move.row, move.col) || this.isOpponentPiece(move.row, move.col, piece.color))) {
                validMoves.push(move);
            }
        });

        return validMoves;
    }

    isInsideBoard(row, column) {
        return row >= 0 && row < 8 && column >= 0 && column < 8;
    }

    getBishopMoves(row, col) {
        const piece = this.state.board[row][col];
        const validMoves = [];

        // Check moves to the top-right
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++) {
            if (this.isEmptySquare(i, j)) {
                validMoves.push({ row: i, col: j });
            } else if (this.isOpponentPiece(i, j, piece.color)) {
                validMoves.push({ row: i, col: j });
                break;
            } else {
                break;
            }
        }

        // Check moves to the top-left
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (this.isEmptySquare(i, j)) {
                validMoves.push({ row: i, col: j });
            } else if (this.isOpponentPiece(i, j, piece.color)) {
                validMoves.push({ row: i, col: j });
                break;
            } else {
                break;
            }
        }

        // Check moves to the bottom-right
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++) {
            if (this.isEmptySquare(i, j)) {
                validMoves.push({ row: i, col: j });
            } else if (this.isOpponentPiece(i, j, piece.color)) {
                validMoves.push({ row: i, col: j });
                break;
            } else {
                break;
            }
        }

        // Check moves to the bottom-left
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--) {
            if (this.isEmptySquare(i, j)) {
                validMoves.push({ row: i, col: j });
            } else if (this
                .isOpponentPiece(i, j, piece.color)) {
                validMoves.push({ row: i, col: j });
                break;
            } else {
                break;
            }
        }

        return validMoves;
    }

    getQueenMoves(row, col) {
        const validMoves = [];

        // Get bishop moves
        validMoves.push(...this.getBishopMoves(row, col));

        // Get rook moves
        validMoves.push(...this.getRookMoves(row, col));

        return validMoves;
    }

    getKingMoves(row, col) {
        const piece = this.state.board[row][col];
        const validMoves = [];

        const moves = [
            { row: row - 1, col: col - 1 },
            { row: row - 1, col },
            { row: row - 1, col: col + 1 },
            { row, col: col + 1 },
            { row: row + 1, col: col + 1 },
            { row: row + 1, col },
            { row: row + 1, col: col - 1 },
            { row, col: col - 1 },
        ];

        moves.forEach((move) => {
            if (this.isInsideBoard(move.row, move.col) && (this.isEmptySquare(move.row, move.col) || this.isOpponentPiece(move.row, move.col, piece.color))) {
                validMoves.push(move);
            }
        });

        return validMoves;
    }

    getValidMoves(row, col) {
        const piece = this.state.board[row][col];
        let validMoves = [];

        switch (piece.type) {
            case "pawn":
                validMoves = this.getPawnMoves(row, col);
                break;
            case "rook":
                validMoves = this.getRookMoves(row, col);
                break;
            case "knight":
                validMoves = this.getKnightMoves(row, col);
                break;
            case "bishop":
                validMoves = this.getBishopMoves(row, col);
                break;
            case "queen":
                validMoves = this.getQueenMoves(row, col);
                break;
            case "king":
                validMoves = this.getKingMoves(row, col);
                break;
            default:
                break;
        }

        return validMoves;
    }

    render() {
        const { board, currentPlayer } = this.state;

        return (
            <div className="game">
                <div className="board">
                    {board.map((row, rowIndex) => (
                        <div className="row" key={rowIndex}>
                            {row.map((piece, colIndex) => (
                                <div key={`${rowIndex}${colIndex}`} draggable={piece != null} data-rowindex={`${rowIndex}`} data-columnindex={`${colIndex}`} onDragStart={this.handleDragStart} onDragOver={this.handleDragOver} onDrop={this.handleDragEnd}>
                                    <span>{`${"ABCDEFGH"[colIndex]}${rowIndex + 1}`}</span>
                                    <Square
                                        color={(rowIndex * 9 + colIndex) % 2 === 0 ? 'white' : 'black'}
                                        key={`${rowIndex}${colIndex}`}
                                        piece={piece}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="status">{`${currentPlayer} to move`}</div>
            </div>
        );
    }
}

export default Game;
