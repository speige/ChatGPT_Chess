import React from 'react';

class Piece extends React.Component {
    render() {
        const piece = this.props.piece;
        const pieceType = piece.type;
        const pieceColor = piece.color;

        return (
            <div className={`piece ${pieceType} ${pieceColor}`}>
            </div>
        );
    }
}

export default Piece;
