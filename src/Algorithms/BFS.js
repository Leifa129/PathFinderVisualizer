import GraphHelper from "./GraphHelper";
import HeuristicSearch from "./HeuristicSearch";

// Breadth-first search is just a special case of dijkstras where all of the edges have the same cost.
// Here we will use the cost of 1 for all edges.
// Although with BFS we dont need to use a priorityque, a normal que would suffice making it more efficient
// However for visualization purposes it makes no difference.
export default class BFS extends HeuristicSearch {

        updateUnvisitedNeighbors(node, finishNode, grid) {
                const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid, this.diagonalMovement);
                for (const neighbor of unvisitedNeighbors) {
                        const temp = node.fScore + (this.diagonalMovement ?
                            ((neighbor.col - node.col === 0 || neighbor.row - node.row === 0 ) ? 1 : Math.SQRT2)
                            : 1);
                        if (temp < neighbor.fScore) {
                                neighbor.fScore = temp;
                                neighbor.previousNode = node;
                        }
                }

        }

}

