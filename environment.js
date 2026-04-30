class Environment {
  constructor(w, h, rows, columns) {
    this.w = w
    this.h = h

    this.rows = rows
    this.columns = columns
    this.walkable = Array.from({ length: this.rows }, () => new Array(this.columns).fill(0));

    this.noiseScale = 0.1;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);

    this.perlinNoiseGeneration();
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

    this.target = new Target(this.walkable[randomIFood][randomJFood].target.pos.x, this.walkable[randomIFood][randomJFood].target.pos.y, 10)
    
    let randomIAgent, randomJAgent; 
    do {
      randomIAgent = floor(random(this.rows))
      randomJAgent = floor(random(this.columns))
    } while(this.walkable[randomIAgent][randomJAgent].terrainType === "Obstacle")

    this.vehicle = new Vehicle(this.walkable[randomIAgent][randomJAgent].target.pos.x, this.walkable[randomIAgent][randomJAgent].target.pos.y, 12);

    this.startNewSearch();
  }
  
  didVehicleReachFood() {
    if (this.vehicle.didReachTarget(this.target)) {

      this.vehicle.pos.set(this.target.pos.x, this.target.pos.y);

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

          fill(cell.color)
          stroke(0, 100);
          rect(cell.target.pos.x - (this.w/this.rows)/2, cell.target.pos.y - (this.h/this.columns)/2, (this.w/this.rows), (this.h/this.columns));
          
          if (cell.isPath) {
            fill(255, 255, 255, 220);
            stroke(0);
            push();
            translate(cell.target.pos.x, cell.target.pos.y);
            rotate(PI / 4);
            rectMode(CENTER);
            let size = (this.w/this.rows) * 0.25;
            rect(0, 0, size, size);
            pop();
          }
          else if (cell.isFrontier) {
            push(); 
            noFill();
            stroke(230, 230, 230, 220); 
            strokeWeight(2);
            rectMode(CENTER); 
            
            let size = (this.w/this.rows) * 0.8; 
            rect(cell.target.pos.x, cell.target.pos.y, size, size, 2); 
            
            pop(); 
          }
          else if (cell.isVisited) {
            fill(0, 0, 0, 100); 
            noStroke();
            circle(cell.target.pos.x, cell.target.pos.y, (this.w/this.rows) * 0.2);
          }
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
          this.walkable[i][j].color.setAlpha(255)
      }
    }

    this.vehicle.vel.set(0, 0);
    this.vehicle.acc.set(0, 0);

    let startIdx = this.getCellIndex(this.vehicle.pos);
    let targetIdx = this.getCellIndex(this.target.pos);
    
    env.currentSearch = new DFS(startIdx, targetIdx, env.walkable);
    
    this.isSearching = true
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
            cell.color.setAlpha(100)
          }
        }
    }
  }

  perlinNoiseGeneration() {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        const randomType = this.singleElementGeneration(i, j);
        
        this.walkable[i][j] = new TerrainCells(new Target(i*(this.w/this.rows) + (this.w/this.rows)/2, j*(this.h/this.columns) + (this.h/this.columns)/2, 5), randomType);
      }
    }
  }

  singleElementGeneration(i, j) {
    const terrainTypes = Object.values(TerrainType);

    const n = noise(
      this.noiseOffsetX + i * this.noiseScale,
      this.noiseOffsetY + j * this.noiseScale
    );

    if (n < 0.35) {
      return terrainTypes[0];
    }
    else if (n < 0.5) {
      return terrainTypes[1];
    }
    else if (n < 0.65) {
      return terrainTypes[2];
    }
    else {
      return terrainTypes[3];
    }
  }
}