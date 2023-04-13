import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Game from './Game';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Game />
    );
  }
}

export default App;
