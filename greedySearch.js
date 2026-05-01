class GreedySearch {
    constructor(initial_pos, target, matrix) {
        this.initial_pos = initial_pos;
        this.target = target;
        this.matrix = matrix;

        this.queue = new PriorityQueue();
        this.queue.push({ pos: initial_pos, path: [] }, this.heuristicFunction(initial_pos));

        this.isFinished = false;
        this.finalPath = [];
    }

    step() {
        if (this.isFinished || this.queue.isEmpty()) return;

        let current = this.queue.pop();
        let x = current.value.pos.x;
        let y = current.value.pos.y;

        if (x === this.target.x && y === this.target.y) {
            this.isFinished = true;
            this.finalPath = [...current.value.path, createVector(x, y)];
            return;
        }

        this.matrix[x][y].isVisited = true;
        this.matrix[x][y].isFrontier = false;

        let neighbors = [
            createVector(x, y + 1),
            createVector(x, y - 1),
            createVector(x + 1, y),
            createVector(x - 1, y)
        ];

        for (let n of neighbors) {
            if (this.canVisit(n.x, n.y)) {
                this.matrix[n.x][n.y].isFrontier = true;
                this.queue.push({ pos: n, path: [...current.value.path, createVector(x, y)] }, this.heuristicFunction(n));
            }
        }
    }

    heuristicFunction(node) {
        return (Math.abs(node.x - this.target.x) + Math.abs(node.y - this.target.y))*20;
    }

    canVisit(x, y) {
        if (x < 0 || x >= this.matrix.length || y < 0 || y >= this.matrix[0].length) {
            return false;
        }
        if (this.matrix[x][y].isVisited) {
            return false;
        }
        if (this.matrix[x][y].isFrontier) {
            return false;
        }
        if (this.matrix[x][y].terrainType === 'Obstacle') {
            return false;
        }

        return true;
    }
}