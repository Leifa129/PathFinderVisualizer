import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/Dijkstra';
import {aStar} from '../Algorithms/AStar';
export default class AlgorithmController {

    static runAlgorithm(grid, startNode, finishNode, algorithm){
        switch(algorithm){
            case 'dijkstra':
               return dijkstra(grid, startNode, finishNode);

            case 'aStar':
                return aStar(grid, startNode, finishNode);
                break;

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