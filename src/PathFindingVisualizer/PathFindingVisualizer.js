import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/Dijkstra';

import './PathFindingVisualizer.css';

let startNodeRow = 10;
let startNodeCol = 15;
let finishNodeRow = 10;
let finishNodeCol = 35;
const NUMBER_OF_ROWS = 20;
const NUMBER_OF_COLS = 50;

export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startSelected: false,
      finishSelected: false,
      ranAlgorithm: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }


  handleMouseDown(row, col) {
    if(startNodeCol === col && startNodeRow === row){
      this.setState({startSelected: true, mouseIsPressed: true});
      return;
    }
    if(finishNodeCol === col && finishNodeRow === row){
      this.setState({finishSelected: true, mouseIsPressed: true});
      return;
    }

    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
    if(this.state.ranAlgorithm)
      this.visualizeInstantDijkstra();

  }

   handleStartChanged(row, col){
    const prevStartNodeRow = startNodeRow;
    const prevStartNodeCol = startNodeCol;
     const {grid} = this.state;
      if(grid[row][col].isWall)
        return;

        startNodeRow = row;
        startNodeCol = col;

        if(!this.state.ranAlgorithm) {
          const {grid} = this.state;
          grid[prevStartNodeRow][prevStartNodeCol].isStart = false;
          grid[startNodeRow][startNodeCol].isStart = true;


          this.setState({grid: grid});
        }

     else {
       this.visualizeInstantDijkstra();
     }


   }

  handleFinishChanged(row, col){
    const prevFinishNodeRow = finishNodeRow;
    const prevFinishNodeCol = finishNodeCol;
    const {grid} = this.state;
    if(grid[row][col].isWall)
      return;
    finishNodeRow = row;
    finishNodeCol = col;

    if(!this.state.ranAlgorithm) {
      grid[prevFinishNodeRow][prevFinishNodeCol].isFinish = false;
      grid[finishNodeRow][finishNodeCol].isFinish = true;

      this.setState({grid: grid});
    }

    else {
      this.visualizeInstantDijkstra();
    }

  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;

    const {grid, ranAlgorithm} = this.state;

    if(this.state.startSelected){
        this.handleStartChanged(row, col);
      return;
    }

    if(this.state.finishSelected){
      this.handleFinishChanged(row, col);
      return;
    }


    const newGrid = getNewGridWithWallToggled(grid, row, col);
    this.setState({grid: newGrid});

    if(ranAlgorithm){
      this.visualizeInstantDijkstra();
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, startSelected: false, finishSelected: false});
  }


  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
      }, 10 * i);
    }
  }

  animateInstantDijkstra(visitedNodesInOrder, nodesInShortestPathOrder){
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
          this.animateInstantShortestPath(nodesInShortestPathOrder);
        return;
      }
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
            'node visitedInstant';

    }
  }

  animateInstantShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-instant-shortest-path';
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    clearGrid(grid);
    const newGrid = resetGrid(grid)
    const startNode = newGrid[startNodeRow][startNodeCol];
    const finishNode = newGrid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setState({ranAlgorithm: true});
  }

  visualizeInstantDijkstra() {
    const {grid} = this.state;
     clearGrid(grid);
    const newGrid = resetGrid(grid)

      const startNode = newGrid[startNodeRow][startNodeCol];
    const finishNode = newGrid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateInstantDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
        <>
          <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {row, col, isFinish, isStart, isWall, weight} = node;
                      return (
                          <Node
                              key={nodeIdx}
                              col={col}
                              weight={weight}
                              isFinish={isFinish}
                              isStart={isStart}
                              isWall={isWall}
                              mouseIsPressed={mouseIsPressed}
                              onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                              onMouseEnter={(row, col) =>
                                  this.handleMouseEnter(row, col)
                              }
                              onMouseUp={() => this.handleMouseUp()}
                              row={row}></Node>
                      );
                    })}
                  </div>
              );
            })}
          </div>
        </>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUMBER_OF_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  const isStart = row === startNodeRow && col === startNodeCol;
  const isFinish = row === finishNodeRow && col === finishNodeCol;
  return {
    col,
    row,
    isStart: isStart,
    isFinish: isFinish,
    distance: Infinity,
    isVisited: false,
    weight: isFinish || isStart ? 0 : 1 + Math.round( Math.random() * 8),
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};



const resetGrid = grid => {
  const newGrid = grid.slice();
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    for (let col = 0; col < NUMBER_OF_COLS; col++) {
      newGrid[row][col].distance = Infinity;
      newGrid[row][col].previousNode = null;
      newGrid[row][col].isVisited = false;
    }
  }

  return newGrid;
}

const clearGrid = grid => {

  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    for (let col = 0; col < NUMBER_OF_COLS; col++) {
      let className = 'node';

      if(row === startNodeRow && col === startNodeCol)
        className = 'node node-start';

      if(row === finishNodeRow && col === finishNodeCol)
        className = 'node node-finish';

      if(grid[row][col].isWall){
        className = 'node node-wall';
      }


      document.getElementById(`node-${row}-${col}`).className =
          className;
    }
  }


}