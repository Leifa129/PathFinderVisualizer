import GraphHelper from "./GraphHelper";
import HeuristicSearch from './HeuristicSearch';

export default class GreedyBestFirstSearch extends HeuristicSearch{


    sortNodesByFScore(unvisitedNodes){
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
    }

    heuristic(neighbor, finishNode){
        return super.heuristic(neighbor, finishNode) * 1000000;
}


}
