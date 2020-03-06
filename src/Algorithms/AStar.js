import GraphHelper from "./GraphHelper";

export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];

    startNode.f = startNode.weight + heuristic(startNode, finishNode);

    const unvisitedNodes = GraphHelper.getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByF(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.f === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, finishNode, grid);
    }
}

function sortNodesByF(nodes){
    nodes.sort( (nodeA, nodeB) => nodeA.f - nodeB.f );
}

function heuristic(startNode, finishNode){
       const dRow = finishNode.row - startNode.row;
       const dCol = finishNode.col - startNode.col;
       return Math.abs(dRow) + Math.abs(dCol);
}

function updateUnvisitedNeighbors(node, finishNode, grid){
    const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {

        const temp = neighbor.weight + heuristic(neighbor, finishNode);
        if (temp < neighbor.f) {
            neighbor.f = temp;
            neighbor.previousNode = node;
        }
    }
}