import HeuristicSearch from "./HeuristicSearch";
      // Base implementation of HeuristicSearch is A* so we dont need to do anything.
export function aStar(grid, startNode, finishNode, diagonalMovement) {
   return (new HeuristicSearch()).search(grid, startNode, finishNode, diagonalMovement);
}