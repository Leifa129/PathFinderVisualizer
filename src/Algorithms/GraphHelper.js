export default class GraphHelper {

    static getUnvisitedNeighbors(node, grid, diagonalMovement) {
        const neighbors = [];
        const {col, row} = node;
        let topIsWall = true;
        let leftIsWall = true;
        let bottomIsWall = true;
        let rightIsWall = true;
        if (row > 0) {
            bottomIsWall = grid[row - 1][col].isWall;
            neighbors.push(grid[row - 1][col]);
        }
        if (row < grid.length - 1) {
            topIsWall = grid[row + 1][col].isWall;
            neighbors.push(grid[row + 1][col]);
        }
        if (col > 0) {
            leftIsWall = grid[row][col - 1].isWall;
            neighbors.push(grid[row][col - 1]);
        }
        if (col < grid[0].length - 1) {
            rightIsWall = grid[row][col + 1].isWall;
            neighbors.push(grid[row][col + 1]);
        }

        if(!diagonalMovement)
        return neighbors.filter(neighbor => !neighbor.isVisited);

        // Doing checks to avoid that the algorithm is cutting corners or jumping through walls diagonally
        if (row > 0 && col > 0)
            if(!leftIsWall || !bottomIsWall)
            neighbors.push(grid[row - 1][col - 1]);
        if (row < grid.length - 1 && col < grid[0].length - 1)
            if(!rightIsWall || !topIsWall)
            neighbors.push(grid[row + 1][col + 1]);
        if (row < grid.length - 1 && col > 0)
            if(!topIsWall || !leftIsWall)
            neighbors.push(grid[row + 1][col - 1]);
        if (row > 0 && col < grid[0].length - 1)
            if(!bottomIsWall || !rightIsWall)
            neighbors.push(grid[row - 1][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }

    static getAllNodes(grid){
        const nodes = [];
        for(const row of grid){
            for(const node of row){
                nodes.push(node);
            }
        }
        return nodes;
    }

    static sortNodesByDistance(unvisitedNodes){
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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