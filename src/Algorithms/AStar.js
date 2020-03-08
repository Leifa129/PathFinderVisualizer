import GraphHelper from "./GraphHelper";

export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];

    startNode.distance = 0;
    startNode.fScore = 0;

    const unvisitedNodes = GraphHelper.getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByFScore(unvisitedNodes);
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

        updateUnvisitedNeighbors(closestNode, finishNode, grid);
    }
}

function sortNodesByFScore(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) =>
    {
        // This is a tie breaker if both scores are equal we should priorities the path with the most progress.
        if(nodeA.fScore - nodeB.fScore === 0){
            return nodeB.distance - nodeA.distance;
        }
        return nodeA.fScore - nodeB.fScore;
    });
}

function heuristic(startNode, finishNode){
       const dRow =  startNode.row - finishNode.row;
       const dCol =  startNode.col - finishNode.col;
       return Math.abs(dRow) + Math.abs(dCol);
}

function updateUnvisitedNeighbors(node, finishNode, grid){
    const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const temp = node.distance + neighbor.weight;
        if ( temp < neighbor.distance) {
            neighbor.distance = temp;
            neighbor.fScore = temp + heuristic(neighbor, finishNode);
            neighbor.previousNode = node;
        }
    }
}