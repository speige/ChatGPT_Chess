import React from 'react';
import Piece from './Piece';

class Square extends React.Component {
    render() {
        return (
            <div className={"square " + this.props.color}>
                <Piece piece={this.props.piece}></Piece>
            </div>
        );
    }
}

export default Square;
