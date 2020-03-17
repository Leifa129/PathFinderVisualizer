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

    /*
     * Note that this function takes the pythagoras of going either 1 step in y direction and then 1 step in x direction  or
     * going 1 step in x direction first and then going one step in y direction. It will return the minimum value of the two cases.
     */

    // TODO possibly remove the use of the square root function.
    static findDiagonalLength(node, neighbor, grid){
        // Diagonal is somewhere to the right
        if(neighbor.col - node.col === 1){
            // Diagonal is towards top right corner
            if(neighbor.row - node.row === 1){
                return Math.min(
                    Math.sqrt(grid[node.row + 1][node.col].isWall ? Infinity : Math.pow(grid[node.row + 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(grid[node.row][node.col + 1].isWall ? Infinity : Math.pow(grid[node.row][node.col + 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
            // Diagonal is towards bottom right corner
            else{
                return Math.min(
                    Math.sqrt(grid[node.row - 1][node.col].isWall ? Infinity
                        : Math.pow(grid[node.row - 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(grid[node.row][node.col + 1].isWall ? Infinity
                        : Math.pow(grid[node.row][node.col + 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
        }
        // Diagonal is somewhere to the left
        else{
            // Diagonal is towards top left corner
            if(neighbor.row - node.row === 1){
                return Math.min(
                    Math.sqrt(grid[node.row + 1][node.col].isWall ? Infinity
                        : Math.pow(grid[node.row + 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(grid[node.row][node.col - 1].isWall ? Infinity
                        : Math.pow(grid[node.row][node.col - 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
            // Diagonal is towards bottom left corner
            else{
                return Math.min(
                    Math.sqrt(Math.pow(grid[node.row - 1][node.col].isWall ? Infinity
                        : grid[node.row - 1][node.col].weight, 2) + Math.pow(neighbor.weight, 2)),
                    Math.sqrt(Math.pow(grid[node.row][node.col - 1].isWall ? Infinity
                        : grid[node.row][node.col - 1].weight, 2) + Math.pow(neighbor.weight, 2))
                )
            }
        }

    }

    static sortNodesByDistance(unvisitedNodes){
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }




}