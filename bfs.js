class BFS {
    constructor(initial_pos, target, matrix){
        this.initial_pos = initial_pos;
        this.target = target;
        this.matrix = matrix;

        this.queue = [ { pos: initial_pos, path: [] } ];
        
        this.isFinished = false;
        this.finalPath = [];
    }

    step() {
        if (this.isFinished || this.queue.length === 0) return;

        let current = this.queue.shift();
        let x = current.pos.x;
        let y = current.pos.y;

        if(x === this.target.x && y === this.target.y) {
            this.isFinished = true;
            this.finalPath = [...current.path, createVector(x, y)]; 
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

                let newPath = [...current.path, createVector(x, y)];
                
                this.queue.push({ pos: n, path: newPath });
            }
        }
    }

    canVisit(x, y){
        if(x < 0 || x >= this.matrix.length || y < 0 || y >= this.matrix[0].length){
            return false;
        }
        if(this.matrix[x][y].isVisited){
            return false;
        }
        if(this.matrix[x][y].isFrontier){
            return false;
        }
        if(this.matrix[x][y].terrainType === 'Obstacle'){
            return false;
        }

        return true;
    }
}
