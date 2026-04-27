let env

function setup() {
  createCanvas(windowWidth, windowHeight);
  let rows = 16;
  let columns = 9;
  env = new Environment(windowWidth, windowHeight, rows, columns)
  env.setup()
}

function draw() {
  background(0);
  fill(255, 0, 0);
  noStroke();
  
  env.didVehicleReachFood()
  env.drawTarget()
  env.drawVehicle()
  env.drawMatrix()
  env.stateMachine()
}
