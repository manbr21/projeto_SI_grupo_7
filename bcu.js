class PriorityQueue {
  constructor() {
    this._heap = [];
  }

  size() {
    return this._heap.length;
  }

  isEmpty() {
    return this._heap.length === 0;
  }

  push(value, priority) {
    const node = { value, priority };
    this._heap.push(node);
    this._bubbleUp(this._heap.length - 1);
  }

  pop() {
    if (this._heap.length === 0) return null;
    if (this._heap.length === 1) return this._heap.pop();

    const min = this._heap[0];
    this._heap[0] = this._heap.pop();
    this._bubbleDown(0);
    return min;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this._heap[parentIndex].priority <= this._heap[index].priority) break;
      [this._heap[parentIndex], this._heap[index]] = [this._heap[index], this._heap[parentIndex]];
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
    const length = this._heap.length;

    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;
      let smallestIndex = index;

      if (
        leftIndex < length &&
        this._heap[leftIndex].priority < this._heap[smallestIndex].priority
      ) {
        smallestIndex = leftIndex;
      }

      if (
        rightIndex < length &&
        this._heap[rightIndex].priority < this._heap[smallestIndex].priority
      ) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) break;
      [this._heap[smallestIndex], this._heap[index]] = [this._heap[index], this._heap[smallestIndex]];
      index = smallestIndex;
    }
  }
}

class BCU {
  constructor(initial_pos, target, matrix) {
    this.initial_pos = initial_pos;
    this.target = target;
    this.matrix = matrix;

    this.isFinished = false;
    this.finalPath = [];

    this._frontier = new PriorityQueue();
    this._cameFrom = new Map();

    this._bestCost = Array.from({ length: matrix.length }, () =>
      Array.from({ length: matrix[0].length }, () => Infinity)
    );

    this._bestCost[initial_pos.x][initial_pos.y] = 0;
    this._frontier.push({ pos: createVector(initial_pos.x, initial_pos.y) }, 0);

    this.matrix[initial_pos.x][initial_pos.y].isFrontier = true;
  }

  step() {
    if (this.isFinished || this._frontier.isEmpty()) return;

    const { value: current, priority: currentCost } = this._frontier.pop();
    const x = current.pos.x;
    const y = current.pos.y;

    if (currentCost !== this._bestCost[x][y]) {
      return;
    }

    const cell = this.matrix[x][y];
    cell.isFrontier = false;
    cell.isVisited = true;

    if (x === this.target.x && y === this.target.y) {
      this.isFinished = true;
      this.finalPath = this._reconstructPath(createVector(x, y));
      return;
    }

    const neighbors = [
      createVector(x, y + 1),
      createVector(x, y - 1),
      createVector(x + 1, y),
      createVector(x - 1, y)
    ];

    for (const n of neighbors) {
      if (!this._inBounds(n.x, n.y)) continue;

      const neighborCell = this.matrix[n.x][n.y];
      if (neighborCell.terrainType === 'Obstacle') continue;
      if (neighborCell.isVisited) continue;

      const newCost = currentCost + neighborCell.cost;
      if (newCost < this._bestCost[n.x][n.y]) {
        this._bestCost[n.x][n.y] = newCost;
        this._cameFrom.set(this._key(n.x, n.y), this._key(x, y));
        this._frontier.push({ pos: createVector(n.x, n.y) }, newCost);
        neighborCell.isFrontier = true;
      }
    }
  }

  _reconstructPath(endPos) {
    const path = [];
    let key = this._key(endPos.x, endPos.y);

    while (true) {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      path.push(createVector(x, y));

      if (x === this.initial_pos.x && y === this.initial_pos.y) break;

      const prev = this._cameFrom.get(key);
      if (!prev) break;
      key = prev;
    }

    path.reverse();
    return path;
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  _inBounds(x, y) {
    return x >= 0 && x < this.matrix.length && y >= 0 && y < this.matrix[0].length;
  }
}
