class Environment {
  constructor(w, h, rows, columns) {
    this.w = w
    this.h = h

    this.rows = rows
    this.columns = columns
    this.walkable = Array.from({ length: this.rows }, () => new Array(this.columns).fill(0));

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        const terrainTypes = Object.values(TerrainType);
        const randomIndex = Math.floor(Math.random() * terrainTypes.length);
        const randomType = terrainTypes[randomIndex];
        
        this.walkable[i][j] = new TerrainCells(new Target(i*(this.w/this.rows) + (this.w/this.rows)/2, j*(this.h/this.columns) + (this.h/this.columns)/2, 5), randomType);
      }
    }    
  }

  setup() {
    this.foodCount = 0;
    this.currentSearch = null;
    this.isSearching = false;

    let randomIFood, randomJFood;
    do {
      randomIFood = floor(random(this.rows))
      randomJFood = floor(random(this.columns))
    } while(this.walkable[randomIFood][randomJFood].terrainType === "Obstacle");

    this.target = new Target(this.walkable[randomIFood][randomJFood].target.pos.x, this.walkable[randomIFood][randomJFood].target.pos.y, 16)
    
    let randomIAgent, randomJAgent; 
    do {
      randomIAgent = floor(random(this.rows))
      randomJAgent = floor(random(this.columns))
    } while(this.walkable[randomIAgent][randomJAgent].terrainType === "Obstacle")

    this.vehicle = new Vehicle(this.walkable[randomIAgent][randomJAgent].target.pos.x, this.walkable[randomIAgent][randomJAgent].target.pos.y);

    this.startNewSearch();
  }
  
  didVehicleReachFood() {
    if (this.vehicle.didReachTarget(this.target)) {
      let randomIFood, randomJFood;
      do {
        randomIFood = floor(random(this.rows))
        randomJFood = floor(random(this.columns))
      } while(this.walkable[randomIFood][randomJFood].terrainType === "Obstacle");

      this.target = new Target(this.walkable[randomIFood][randomJFood].target.pos.x, this.walkable[randomIFood][randomJFood].target.pos.y, 16)
      this.foodCount++;
      print("food:" + this.foodCount);

      this.startNewSearch();
    }
  }
  
  drawVehicle() {
    this.vehicle.update();
    this.vehicle.show();
  }
  
  drawTarget() {
    this.target.show()
  }
  
  drawMatrix() {
    for(let i = 0; i < this.rows; i++) {
        for(let j = 0; j < this.columns; j++) {
          let cell = this.walkable[i][j];

          let currentAlpha = 30;
          
          if (cell.isPath) currentAlpha = 255;
          else if (cell.isVisited) currentAlpha = 150;
          else if (cell.isFrontier) currentAlpha = 70;

          cell.color.setAlpha(currentAlpha);

          fill(cell.color)
          stroke(255, 100);
          rect(cell.target.pos.x - (this.w/this.rows)/2, cell.target.pos.y - (this.h/this.columns)/2, (this.w/this.rows), (this.h/this.columns));

          fill(255,255,255,50);
          circle(this.walkable[i][j].target.pos.x, this.walkable[i][j].target.pos.y, this.walkable[i][j].target.r*2);
        }
    }
  }

  getCellIndex(pos) {
    return createVector(
        floor(pos.x / (this.w / this.rows)),
        floor(pos.y / (this.h / this.columns))
    );
  }

  startNewSearch() {
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.columns; j++) {
          this.walkable[i][j].isVisited = false;
          this.walkable[i][j].isFrontier = false;
          this.walkable[i][j].isPath = false;
      }
    }

    this.vehicle.vel.set(0, 0);
    this.vehicle.acc.set(0, 0);

    let startIdx = this.getCellIndex(this.vehicle.pos);
    let targetIdx = this.getCellIndex(this.target.pos);

    this.currentSearch = new DFS(startIdx, targetIdx, this.walkable);
    
    this.isSearching = true; 

    this.pathIndex = 0
  }

  stateMachine() {
    if (this.isSearching) {
        if (frameCount % 15 == 0) {
          this.currentSearch.step();
          if (this.currentSearch.isFinished) {
            this.isSearching = false;
            for (let p of this.currentSearch.finalPath) {
              this.walkable[p.x][p.y].isPath = true;
            }
          }
        }
    } else {
        if (this.currentSearch && this.currentSearch.finalPath && this.pathIndex < this.currentSearch.finalPath.length) {
          let nextStep = this.currentSearch.finalPath[this.pathIndex];

          let cell = this.walkable[nextStep.x][nextStep.y];

          this.vehicle.seek(cell.target);

          if (this.vehicle.didReachTarget(cell.target)) {
            this.pathIndex++;
          }
        }
    }
  }
}