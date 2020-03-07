import GraphHelper from "./GraphHelper";

export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
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
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

function updateUnvisitedNeighbors(node, grid){
    const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {

         const temp = node.distance + neighbor.weight;
         if(temp < neighbor.distance) {
             neighbor.distance = temp;
             neighbor.previousNode = node;
         }
        //For unweighted graphs, basically breadth first search.
       // neighbor.distance = node.distance + 1;
       // neighbor.previousNode = node;
    }

}



export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}