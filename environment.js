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
    this.initialState = true
    this.currI = 0
    this.currJ = 0

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
      
      this.currI = 0;
      this.currJ = 0;
      this.initialState = true;
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
        stroke(255, 100);
        fill(this.walkable[i][j].color);
        rect(this.walkable[i][j].target.pos.x - (this.w/this.rows)/2, this.walkable[i][j].target.pos.y - (this.h/this.columns)/2, (this.w/this.rows), (this.h/this.columns));
        noStroke();
        fill(255,255,255,50);
        circle(this.walkable[i][j].target.pos.x, this.walkable[i][j].target.pos.y, this.walkable[i][j].target.r*2);
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