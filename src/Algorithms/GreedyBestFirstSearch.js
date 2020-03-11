import HeuristicSearch from './HeuristicSearch';

export default class GreedyBestFirstSearch extends HeuristicSearch{


    heuristic(neighbor, finishNode){
        return super.heuristic(neighbor, finishNode) * 1000000;
}


}
