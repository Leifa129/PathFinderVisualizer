import Dijkstra from '../Algorithms/Dijkstra';
import {aStar} from '../Algorithms/AStar';
import GreedyBestFirstSearch from "./GreedyBestFirstSearch";
import BFS from './BFS';
export default class AlgorithmController {

    static runAlgorithm(grid, startNode, finishNode, algorithm){
        switch(algorithm){
            case 'dijkstra':
               return new Dijkstra().search(grid, startNode, finishNode);

            case 'aStar':
                return aStar(grid, startNode, finishNode);

            case 'greedyBestFirstSearch':
                return new GreedyBestFirstSearch().search(grid, startNode, finishNode);

            case 'breadthFirstSearch':
                return new BFS().search(grid, startNode, finishNode);

            default:
                break;
        }

    }

    static getNodesInShortestPathOrder(finishNode) {
        const nodesInShortestPathOrder = [];
        let currentNode = finishNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    }

}