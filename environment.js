class Environment {
  constructor(w, h, rows, columns) {
    this.w = w
    this.h = h
    this.vehicle = new Vehicle(this.w/2, this.h/2);
    this.target = null
    this.foodCount = 0;
    
    this.initialState = true
    this.currI = 0
    this.currJ = 0
    
    this.rows = rows
    this.columns = columns
    this.matrix = Array.from({ length: this.rows + 1 }, () => new Array(this.columns + 1).fill(0));
    this.walkable = Array.from({ length: this.rows + 1 }, () => new Array(this.columns + 1).fill(0));
  }
  
  didVehicleReachFood() {
    if (this.vehicle.didReachTarget(this.target)) {
      let randomI = floor(random(this.rows))
      let randomJ = floor(random(this.columns))
      this.target = new Target(this.walkable[randomI][randomJ].target.pos.x, this.walkable[randomI][randomJ].target.pos.y, 16)
      this.foodCount++;
      print("food:" + this.foodCount);
      
      this.currI = 0;
      this.currJ = 0;
      this.initialState = true;
    }
  }
  
  drawVehicle() {
    this.vehicle.update();
    this.vehicle.show();
  }
  
  populateMatrix() {
    for(let i = 0; i <= this.rows; i++) {
      for(let j = 0; j <= this.columns; j++) {
        this.matrix[i][j] = createVector(i*(this.w/this.rows), j*(this.h/this.columns))
        if(i < this.rows && j < this.columns) {
          const terrainTypes = Object.values(TerrainType);
          const randomIndex = Math.floor(Math.random() * terrainTypes.length);
          const randomType = terrainTypes[randomIndex];
          this.walkable[i][j] = new TerrainCells(new Target(i*(this.w/this.rows) + (this.w/this.rows)/2, j*(this.h/this.columns) + (this.h/this.columns)/2, 5), randomType)
        }
      }
    }
    let randomI = floor(random(this.rows))
    let randomJ = floor(random(this.columns))
    this.target = new Target(this.walkable[randomI][randomJ].target.pos.x, this.walkable[randomI][randomJ].target.pos.y, 16)
  }
  
  drawTarget() {
    this.target.show()
  }
  
  drawMatrix() {
    for(let i = 0; i <= this.rows; i++) {
      for(let j = 0; j <= this.columns; j++) {
        noFill();
        stroke(255, 100);
        rect(this.matrix[i][j].x, this.matrix[i][j].y, (this.w/this.rows), (this.h/this.columns));
        
        if(i < this.rows && j < this.columns) {
          fill(this.walkable[i][j].color);
          rect(this.walkable[i][j].target.pos.x, this.walkable[i][j].target.pos.y, (this.w/this.rows), (this.h/this.columns));
          noStroke();
          fill(255,255,255,50);
          circle(this.walkable[i][j].target.pos.x, this.walkable[i][j].target.pos.y, this.walkable[i][j].target.r*2);
        }
      }
    }
  }
  
  stateMachine() {
    if(this.initialState) {
      this.vehicle.seek(this.walkable[0][0].target);
      if (this.vehicle.didReachTarget(this.walkable[0][0].target)) {
        this.initialState = false;
      }
    } else {
      this.vehicle.seek(this.walkable[this.currI][this.currJ].target);
      
      if(this.vehicle.didReachTarget(this.walkable[this.currI][this.currJ].target)) {
        if(this.currI % 2 == 0) {
          this.currJ += 1;
          if(this.currJ >= this.columns) {
            this.currI += 1;
            this.currJ = this.columns - 1;
          }
        } else {
          this.currJ -= 1;
          if(this.currJ < 0) {
            this.currI += 1;
            this.currJ = 0;
          }
        }
        if(this.currI >= this.rows) {
          this.currI = 0;
          this.currJ = 0;
          this.initialState = true;
        }
      }
    } 
  }
}