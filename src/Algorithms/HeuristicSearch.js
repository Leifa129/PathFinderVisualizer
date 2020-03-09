import GraphHelper from "./GraphHelper";

// This class implements A*, but also leaves methods that can be overridden in order to implement other algorithms that relies on heuristics.
export default class HeuristicSearch {
    search(grid, startNode, finishNode) {
        const visitedNodesInOrder = [];

        startNode.distance = 0;
        startNode.fScore = 0;

        const unvisitedNodes = GraphHelper.getAllNodes(grid);
        while (!!unvisitedNodes.length) {
            this.sortNodesByFScore(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            // If we encounter a wall, we skip it.
            if (closestNode.isWall) continue;
            // If the closest node is at a distance of infinity,
            // we must be trapped and should therefore stop.
            if (closestNode.fScore === Infinity) return visitedNodesInOrder;
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            if (closestNode === finishNode) {
                return visitedNodesInOrder;
            }

            this.updateUnvisitedNeighbors(closestNode, finishNode, grid);
        }
    }
    sortNodesByFScore(unvisitedNodes){
        unvisitedNodes.sort((nodeA, nodeB) =>
        {
            // This is a tie breaker if both scores are equal we should priorities the path with the most progress.
            if(nodeA.fScore - nodeB.fScore === 0){
                return nodeB.distance - nodeA.distance;
            }
            return nodeA.fScore - nodeB.fScore;
        });
    }

    // Default manhattan distance
   heuristic(startNode, finishNode){
        const dRow =  startNode.row - finishNode.row;
        const dCol =  startNode.col - finishNode.col;
        return Math.abs(dRow) + Math.abs(dCol);
    }

   updateUnvisitedNeighbors(node, finishNode, grid){
        const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
        for (const neighbor of unvisitedNeighbors) {
            const temp = node.distance + neighbor.weight;
            if ( temp < neighbor.distance) {
                neighbor.distance = temp;
                neighbor.fScore = temp + this.heuristic(neighbor, finishNode);
                neighbor.previousNode = node;
            }
        }
    }

}



