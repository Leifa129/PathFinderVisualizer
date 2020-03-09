import GraphHelper from "./GraphHelper";
import HeuristicSearch from './HeuristicSearch';

export default class GreedyBestFirstSearch extends HeuristicSearch{

    bestFirstSearch(grid, startNode, finishNode){
        return super.search(grid, startNode, finishNode);
    }


    sortNodesByFScore(unvisitedNodes){
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
    }

    updateUnvisitedNeighbors(node, finishNode, grid){
        const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
        for (const neighbor of unvisitedNeighbors) {
            //const temp = neighbor.weight + super.heuristic(neighbor, finishNode) - 1;
            const temp = super.heuristic(neighbor, finishNode);
            if ( temp < neighbor.fScore) {
                neighbor.fScore = temp;
                neighbor.previousNode = node;
            }
        }
    }

}
