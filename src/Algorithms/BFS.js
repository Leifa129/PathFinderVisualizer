import GraphHelper from "./GraphHelper";
import HeuristicSearch from "./HeuristicSearch";

// Breadth-first search is just a special case of dijkstras where all of the edges have the same cost.
// Here we will use the cost of 1 for all edges.
export default class BFS extends HeuristicSearch {

        updateUnvisitedNeighbors(node, finishNode, grid) {
                const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
                for (const neighbor of unvisitedNeighbors) {
                        const temp = node.fScore + 1;
                        if (temp < neighbor.fScore) {
                                neighbor.fScore = temp;
                                neighbor.previousNode = node;
                        }
                }

        }

}

