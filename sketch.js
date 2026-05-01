let env;

function setup() {
  let container = document.getElementById('canvas-container');
  let availableW = container.clientWidth;
  let availableH = container.clientHeight;

  let ratio = 48 / 27; 
  let canvasW = availableW;
  let canvasH = availableW / ratio;

  if (canvasH > availableH) {
    canvasH = availableH;
    canvasW = canvasH * ratio;
  }

  let canvas = createCanvas(canvasW, canvasH);
  canvas.parent('canvas-container');

  let rows = 48;
  let columns = 27;
  
  env = new Environment(width, height, rows, columns);
  env.setup();
}

function draw() {
  background(0);
  fill(255, 0, 0);
  noStroke();
  
  env.didVehicleReachFood()
  env.drawMatrix()
  env.drawVehicle()
  env.drawTarget()
  env.stateMachine()
}
