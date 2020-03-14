import React, {Component} from 'react';
import Node from './Node/Node';

import './PathFindingVisualizer.css';
import AlgorithmController from '../Algorithms/AlgorithmController';
import Dropdown from "react-bootstrap/Dropdown";

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
            allowDiagonals: false,
            speed: 'Normal',
        };
    }


    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }


    handleMouseDown(row, col) {
        this.clearTimers();

        if (startNodeCol === col && startNodeRow === row) {
            this.setState({startSelected: true, mouseIsPressed: true});
            return;
        }
        if (finishNodeCol === col && finishNodeRow === row) {
            this.setState({finishSelected: true, mouseIsPressed: true});
            return;
        }

        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
        if (this.state.ranAlgorithm)
            this.visualizeInstantAlgorithm();

    }

    handleStartChanged(row, col) {
        const prevStartNodeRow = startNodeRow;
        const prevStartNodeCol = startNodeCol;
        const {grid} = this.state;
        if (grid[row][col].isWall)
            return;

        startNodeRow = row;
        startNodeCol = col;

        grid[prevStartNodeRow][prevStartNodeCol].isStart = false;
        grid[startNodeRow][startNodeCol].isStart = true;


        this.setState({grid: grid});

        if (this.state.ranAlgorithm) {
            this.visualizeInstantAlgorithm();
        }


    }

    handleFinishChanged(row, col) {
        const prevFinishNodeRow = finishNodeRow;
        const prevFinishNodeCol = finishNodeCol;
        const {grid} = this.state;
        if (grid[row][col].isWall)
            return;
        finishNodeRow = row;
        finishNodeCol = col;


        grid[prevFinishNodeRow][prevFinishNodeCol].isFinish = false;
        grid[finishNodeRow][finishNodeCol].isFinish = true;

        this.setState({grid: grid});

        if (this.state.ranAlgorithm) {
            this.visualizeInstantAlgorithm();
        }

    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;

        const {grid, ranAlgorithm} = this.state;

        if (this.state.startSelected) {
            this.handleStartChanged(row, col);
            return;
        }

        if (this.state.finishSelected) {
            this.handleFinishChanged(row, col);
            return;
        }

        // Make sure that we dont put a wall over the start or finish node
        if (!(row === startNodeRow && col === startNodeCol) && !(row === finishNodeRow && col === finishNodeCol)) {
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

    timers = [];
    shortestPathTimers = [];

    clearTimers(){
        for(let i = 0; i < this.timers.length; i++){
            clearTimeout(this.timers[i]);
        }
        for(let i = 0; i < this.shortestPathTimers.length; i++){
            clearTimeout(this.shortestPathTimers[i]);
        }

        this.timers = [];
        this.shortestPathTimers = [];
    }

    animateSearchSpace(visitedNodesInOrder, nodesInShortestPathOrder) {
        this.clearTimers();
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
                if (i === visitedNodesInOrder.length) {
                    this.timers.push(setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10 * i * this.getSpeed()));
                    return;
                }
                this.timers.push(setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
                }, 10 * i * this.getSpeed()));
        }
    }

    animateInstantAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
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
              this.shortestPathTimers.push(setTimeout(() => {
                const node = nodesInShortestPathOrder[i];

                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i * this.getSpeed()));
        }
    }

    getSpeed() {
        let multiplier = 1.0;
        const {speed} = this.state;

        if (speed === 'Fast')
            multiplier = 0.5;

        if (speed === 'Slow')
            multiplier = 2;

        return multiplier;

    }

    visualizeAlgorithm() {
        const {grid, selectedAlgorithm, allowDiagonals} = this.state;
        clearGrid(grid);
        const newGrid = resetGrid(grid);
        const startNode = newGrid[startNodeRow][startNodeCol];
        const finishNode = newGrid[finishNodeRow][finishNodeCol];

        const visitedNodesInOrder = AlgorithmController.runAlgorithm(newGrid, startNode, finishNode, selectedAlgorithm, allowDiagonals);
        const nodesInShortestPathOrder = AlgorithmController.getNodesInShortestPathOrder(finishNode);
        this.animateSearchSpace(visitedNodesInOrder, nodesInShortestPathOrder);
        this.setState({ranAlgorithm: true});
    }

    generateWeights() {
        const newGrid = this.state.grid.slice();
        for (let i = 0; i < NUMBER_OF_ROWS; i++) {
            for (let j = 0; j < NUMBER_OF_COLS; j++) {
                if (Math.random() < 0.1) {
                    newGrid[i][j].weight = Math.round(1 + Math.random() * 8);
                }
            }
        }
        this.setState({grid: newGrid});

    }

    diagonalMovementsChanged() {
        this.setState(prevState => {
           return {allowDiagonals: !prevState.allowDiagonals}
        }, () => {
            if(this.state.ranAlgorithm){
                this.clearTimers();
                this.visualizeInstantAlgorithm();
            }
        });

    }

    visualizeInstantAlgorithm() {
        const {grid, selectedAlgorithm, allowDiagonals} = this.state;
        clearGrid(grid);
        const newGrid = resetGrid(grid)

        const startNode = newGrid[startNodeRow][startNodeCol];
        const finishNode = newGrid[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = AlgorithmController.runAlgorithm(newGrid, startNode, finishNode, selectedAlgorithm, allowDiagonals);
        const nodesInShortestPathOrder = AlgorithmController.getNodesInShortestPathOrder(finishNode);
        this.animateInstantAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    clearBoard() {
        const grid = getInitialGrid();
        const ranAlgorithm = false;
        this.setState({grid, ranAlgorithm});
        this.clearTimers();
        clearGrid(grid);

    }

    setSpeed(speed) {
        this.setState({speed});
    }

    render() {
        const {grid, mouseIsPressed, selectedAlgorithm} = this.state;

        return (
            <>
                <div className="header" style={{backgroundColor: 'gray'}}>
                    <div className="item form-group" style={{flexGrow: 2}}>
                        <select className="form-control w-75 mt-3   float-right " value={selectedAlgorithm}
                                onChange={event => {
                                    this.setState({selectedAlgorithm: event.target.value})
                                }}
                                id="selectedAlgorithm">
                            <option value="dijkstra">Dijkstra's algorithm</option>
                            <option value="aStar">A* algorithm</option>
                            <option value="greedyBestFirstSearch">Greedy Best-first Search</option>
                            <option value="breadthFirstSearch">Breadth-first Search</option>
                        </select>
                    </div>
                    <div className="item form-check">
                        <label htmlFor="allowDiagonals" className="mt-4 ml-4 text-white-50" style={{userSelect: 'none', fontSize:'18px'}}>
                            <input className="form-check-item " style={{width:'18px', height:'18px'}} type="checkbox"
                                   id="allowDiagonals"
                                   value={this.state.allowDiagonals}
                                   onChange={() => this.diagonalMovementsChanged()}  />
                            Allow diagonals
                        </label>

                    </div>
                    <div className="item">
                        <button className="btn btn-success ml-3 mt-3 float-left"
                                onClick={() => this.visualizeAlgorithm()}>
                            Visualize Algorithm
                        </button>
                    </div>

                    <div className="item">
                        <button className="btn btn-primary mr-3 mt-3 float-right"
                                onClick={() => this.generateWeights()}>Generate weights
                        </button>
                    </div>


                    <div className="item">
                        <button className="btn btn-danger mt-3 mr-5" onClick={() => this.clearBoard()}>
                            Clear board
                        </button>
                    </div>
                    <div className="item mt-3 ml-5" style={{width: '200px', maxWidth: '200px'}}>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                Speed: {this.state.speed}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="bg-dark">
                                <Dropdown.Item className="text-danger"
                                               onClick={() => this.setSpeed('Fast')}>Fast</Dropdown.Item>
                                <Dropdown.Item className="text-success"
                                               onClick={() => this.setSpeed('Normal')}>Normal</Dropdown.Item>
                                <Dropdown.Item className="text-primary"
                                               onClick={() => this.setSpeed('Slow')}>Slow</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>


                <div className="d-flex justify-content-center p-2">
                    <div className="node node-start  mr-2"></div>
                    <div>Start Node</div>

                    <div className="node node-finish ml-5 mr-2"></div>
                    <div>Finish Node</div>

                    <div className="node node-instant-shortest-path ml-5 mr-2"></div>
                    <div>Shortest-path Node</div>

                    <div className="node ml-5 mr-2"></div>
                    <div>Unvisited Node</div>

                    <div className="node ml-5 mr-2" style={{backgroundColor: 'rgba(0, 190, 218, 0.75)'}}></div>
                    <div>Visited Node</div>

                    <div className="node node-wall ml-5 mr-2"></div>
                    <div>Wall Node</div>
                </div>

                {
                    this.state.selectedAlgorithm === 'breadthFirstSearch'  ?
                <span className="d-flex justify-content-center">
                    <span className={"mt-3 text-danger"} style={{fontSize: '20px'}}>
                        Note that breadth first search doesn't consider weights.</span>
                </span> :
                        // DONT ASK xD
                    <div>
                        <div style={{fontSize: '14.5px'}}>&nbsp;</div>
                        <div>&nbsp;</div>
                    </div>
                }

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
        weight: 1,
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

            if (row === startNodeRow && col === startNodeCol)
                className = 'node node-start';

            if (row === finishNodeRow && col === finishNodeCol)
                className = 'node node-finish';

            if (grid[row][col].isWall) {
                className = 'node node-wall';
            }


            document.getElementById(`node-${row}-${col}`).className =
                className;
        }
    }


}