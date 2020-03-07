import GraphHelper from "./GraphHelper";

export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];

    startNode.distance =  heuristic(startNode, finishNode);

    const unvisitedNodes = GraphHelper.getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        GraphHelper.sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, finishNode, grid);
    }
}

// Find how many walls there are in path maybe
function heuristic(startNode, finishNode){
       const dRow = finishNode.row - startNode.row;
       const dCol = finishNode.col - startNode.col;
       return Math.abs(dRow) + Math.abs(dCol);
}

function updateUnvisitedNeighbors(node, finishNode, grid){
    const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {

        const temp = neighbor.weight + heuristic(neighbor, finishNode);
        if (temp < neighbor.distance) {
            neighbor.distance = temp;
            neighbor.previousNode = node;
        }
    }
}