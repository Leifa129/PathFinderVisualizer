import GraphHelper from "./GraphHelper";
import HeuristicSearch from "./HeuristicSearch";


// Dijkstras is infact a special case of A* algorithm where heuristic = 0. In other words, we only rely on the distance from the start node.
export default class Dijkstra extends HeuristicSearch {

    updateUnvisitedNeighbors(node, finishNode, grid) {
        const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
        for (const neighbor of unvisitedNeighbors) {
            const temp = node.fScore + neighbor.weight;
            if (temp < neighbor.fScore) {
                neighbor.fScore = temp;
                neighbor.previousNode = node;
            }
        }

    }

}

