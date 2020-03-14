import GraphHelper from "./GraphHelper";

// This class implements A*, but also leaves methods that can be overridden in order to implement other algorithms that relies on heuristics.
// Could use a heap for better performances, but for visualization purposes it makes no difference.
export default class HeuristicSearch {
    diagonalMovement = false;

    search(grid, startNode, finishNode, diagonalMovement) {
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        startNode.fScore = 0;
        this.diagonalMovement = diagonalMovement;

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


    heuristic(node, finishNode){
        const dRow =  Math.abs(node.row - finishNode.row);
        const dCol =  Math.abs(node.col - finishNode.col);
        if(!this.diagonalMovement)
            return dRow + dCol;

        const D = Math.SQRT2 - 1;
        return (dCol < dRow)  ?  (D * dCol + dRow) : (D * dRow + dCol);
    }


    /*
    * Note that this function takes the pythagoras of going either first 1 step in y direction and then 1 step in x direction  or
    * going 1 step in x direction first and then going one step in y direction. It will return the minimum value of the two cases.
     */
    // TODO check for walls
    findDiagonalLength(node, neighbor, grid){
        // Diagonal is somewhere to the right
        if(neighbor.col - node.col === 1){
            // Diagonal is towards top right corner
            if(neighbor.row - node.row === 1){
                return Math.min(
                    Math.sqrt(Math.pow(grid[node.row + 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(Math.pow(grid[node.row][node.col + 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
            // Diagonal is towards bottom right corner
            else{
                return Math.min(
                    Math.sqrt(Math.pow(grid[node.row - 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(Math.pow(grid[node.row][node.col + 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
        }
        // Diagonal is somewhere to the left
        else{
            // Diagonal is towards top left corner
            if(neighbor.row - node.row === 1){
                return Math.min(
                    Math.sqrt(Math.pow(grid[node.row + 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(Math.pow(grid[node.row][node.col - 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
            // Diagonal is towards bottom left corner
            else{
                return Math.min(
                    Math.sqrt(Math.pow(grid[node.row - 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(Math.pow(grid[node.row][node.col - 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
        }

    }

    updateUnvisitedNeighbors(node, finishNode, grid){
        const unvisitedNeighbors = GraphHelper.getUnvisitedNeighbors(node, grid, this.diagonalMovement);
        for (const neighbor of unvisitedNeighbors) {
            // Weighted currently not supported with diagonal movements.
            const temp = node.distance +
                (this.diagonalMovement ?
                    ((neighbor.col - node.col === 0 || neighbor.row - node.row === 0 ) ? neighbor.weight : this.findDiagonalLength(node, neighbor, grid))
                    : neighbor.weight);
            if ( temp < neighbor.distance) {
                neighbor.distance = temp;
                neighbor.fScore = temp + this.heuristic(neighbor, finishNode);
                neighbor.previousNode = node;
            }
        }
    }

}



