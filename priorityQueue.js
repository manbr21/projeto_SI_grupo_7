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
