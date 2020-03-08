import React, {Component} from 'react';
import Node from './Node/Node';

import './PathFindingVisualizer.css';
import AlgorithmController from '../Algorithms/AlgorithmController';

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
      selectedAlgorithm: 'dijkstra',
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
      this.visualizeInstantAlgorithm();

  }

   handleStartChanged(row, col){
    const prevStartNodeRow = startNodeRow;
    const prevStartNodeCol = startNodeCol;
     const {grid} = this.state;
      if(grid[row][col].isWall)
        return;

        startNodeRow = row;
        startNodeCol = col;

          grid[prevStartNodeRow][prevStartNodeCol].isStart = false;
          grid[startNodeRow][startNodeCol].isStart = true;


          this.setState({grid: grid});

     if(this.state.ranAlgorithm) {
       this.visualizeInstantAlgorithm();
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


      grid[prevFinishNodeRow][prevFinishNodeCol].isFinish = false;
      grid[finishNodeRow][finishNodeCol].isFinish = true;

      this.setState({grid: grid});

    if(this.state.ranAlgorithm) {
      this.visualizeInstantAlgorithm();
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

    // Make sure that we dont put a wall over the start or finish node
      if(!(row === startNodeRow && col == startNodeCol) && !(row === finishNodeRow && col === finishNodeCol) ) {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        this.setState({grid: newGrid});

        if (ranAlgorithm) {
          this.visualizeInstantAlgorithm();
        }
      }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, startSelected: false, finishSelected: false});
  }


  animateSearchSpace(visitedNodesInOrder, nodesInShortestPathOrder) {
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

  animateInstantAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder){
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

  visualizeAlgorithm() {
    const {grid, selectedAlgorithm} = this.state;
    clearGrid(grid);
    const newGrid = resetGrid(grid);
    const startNode = newGrid[startNodeRow][startNodeCol];
    const finishNode = newGrid[finishNodeRow][finishNodeCol];

    const visitedNodesInOrder = AlgorithmController.runAlgorithm(newGrid, startNode, finishNode, selectedAlgorithm);
    const nodesInShortestPathOrder = AlgorithmController.getNodesInShortestPathOrder(finishNode);
    this.animateSearchSpace(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setState({ranAlgorithm: true});
  }

    generateWeights() {
      const newGrid = this.state.grid.slice();
        for(let i = 0; i < NUMBER_OF_ROWS; i++){
          for(let j = 0; j < NUMBER_OF_COLS; j++){
            if(Math.random() < 0.1){
              newGrid[i][j].weight = Math.round(1 + Math.random() * 8);
            }
          }
      }
      this.setState({grid: newGrid});

  }

  visualizeInstantAlgorithm() {
    const {grid, selectedAlgorithm} = this.state;
     clearGrid(grid);
    const newGrid = resetGrid(grid)

      const startNode = newGrid[startNodeRow][startNodeCol];
    const finishNode = newGrid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = AlgorithmController.runAlgorithm(newGrid, startNode, finishNode, selectedAlgorithm);
    const nodesInShortestPathOrder = AlgorithmController.getNodesInShortestPathOrder(finishNode);
    this.animateInstantAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed, selectedAlgorithm} = this.state;

    return (
        <>
          <div className="header">
            <div className="item form-group">
            <select className="form-control w-50 m-2 float-right " value={selectedAlgorithm}
                    onChange={event => {
                      this.setState({selectedAlgorithm: event.target.value})
                    }}
                    id="selectedAlgorithm">
              <option value="dijkstra">Dijkstra's algorithm</option>
              <option value="aStar">A* algorithm</option>
            </select>
          </div>
            <div className="item">
          <button className="btn btn-outline-success ml-3 mt-2 float-left"  onClick={() => this.visualizeAlgorithm()}>
            Visualize Algorithm
          </button>
          </div>

            <div className="item">
              <button className="btn btn-outline-primary mr-3 mt-2 float-left" onClick={() => this.generateWeights()}>Generate weights</button>
            </div>
          </div>

          <div className="d-flex justify-content-center p-2">
            <div className="node node-start  mr-2"></div>
            <div>Start Node</div>

            <div className="node node-finish ml-5 mr-2"></div>
            <div>Finish Node</div>

            <div className="node node-instant-shortest-path ml-5 mr-2"></div>
            <div>Optimal-path Node</div>

            <div className="node ml-5 mr-2"></div>
            <div>Unvisited Node</div>

            <div className="node ml-5 mr-2" style={{backgroundColor: 'rgba(0, 190, 218, 0.75)'}}> </div>
            <div>Visited Node</div>

            <div className="node node-wall ml-5 mr-2"></div>
            <div>Wall Node</div>
          </div>

          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {row, col, isFinish, isStart, isWall, weight, isVisited} = node;
                      return (
                          <Node
                              key={nodeIdx}
                              col={col}
                              weight={weight}
                              isFinish={isFinish}
                              isStart={isStart}
                              isWall={isWall}
                              isVisited={isVisited}
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
    weight:  1,
    fScore: Infinity,
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
      newGrid[row][col].fScore = Infinity;
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