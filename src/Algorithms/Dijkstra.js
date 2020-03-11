import HeuristicSearch from "./HeuristicSearch";


// Dijkstras is infact a special case of A* algorithm where heuristic = 0. In other words, we only rely on the distance from the start node.
export default class Dijkstra extends HeuristicSearch {

    heuristic(startNode, finishNode, diagonalMovement) {
        return 0;
    }

}

