import HeuristicSearch from './HeuristicSearch';

export default class GreedyBestFirstSearch extends HeuristicSearch{


    heuristic(neighbor, finishNode){
        return neighbor.weight * super.heuristic(neighbor, finishNode) * 1000000;
}


}
