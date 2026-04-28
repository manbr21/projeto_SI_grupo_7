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

    this.target = new Target(this.walkable[randomIFood][randomJFood].target.pos.x, this.walkable[randomIFood][randomJFood].target.pos.y, 8)
    
    let randomIAgent, randomJAgent; 
    do {
      randomIAgent = floor(random(this.rows))
      randomJAgent = floor(random(this.columns))
    } while(this.walkable[randomIAgent][randomJAgent].terrainType === "Obstacle")

    this.vehicle = new Vehicle(this.walkable[randomIAgent][randomJAgent].target.pos.x, this.walkable[randomIAgent][randomJAgent].target.pos.y, 8);

    this.startNewSearch();
  }
  
  didVehicleReachFood() {
    if (this.vehicle.didReachTarget(this.target)) {
      let randomIFood, randomJFood;
      do {
        randomIFood = floor(random(this.rows))
        randomJFood = floor(random(this.columns))
      } while(this.walkable[randomIFood][randomJFood].terrainType === "Obstacle");

      this.target = new Target(this.walkable[randomIFood][randomJFood].target.pos.x, this.walkable[randomIFood][randomJFood].target.pos.y, 8)
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
          
          if (cell.terrainType != "Obstacle") {
            let currentAlpha = 70;
          
            if (cell.isPath) currentAlpha = 255;
            else if (cell.isVisited) currentAlpha = 180;
            else if (cell.isFrontier) currentAlpha = 100;

            cell.color.setAlpha(currentAlpha);
          }

          fill(cell.color)
          stroke(0, 100);
          rect(cell.target.pos.x - (this.w/this.rows)/2, cell.target.pos.y - (this.h/this.columns)/2, (this.w/this.rows), (this.h/this.columns));
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
        this.currentSearch.step();
          if (this.currentSearch.isFinished) {
            this.isSearching = false;
            for (let p of this.currentSearch.finalPath) {
              this.walkable[p.x][p.y].isPath = true;
            }
          }
    } else {
        let currPos = this.getCellIndex(this.vehicle.pos)
      
        if (currPos.x >= 0 && currPos.x < this.rows && currPos.y >= 0 && currPos.y < this.columns) {
          let currCell = this.walkable[currPos.x][currPos.y]
          
          if (currCell.terrainType == 'Sand') {
              this.vehicle.maxSpeed = 6
            } else if (currCell.terrainType == 'Quagmire') {
              this.vehicle.maxSpeed = 4
            } else {
              this.vehicle.maxSpeed = 2
            }
        }


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