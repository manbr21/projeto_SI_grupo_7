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

  document.getElementById('btnNovoMapa').addEventListener('click', () => {
    env = new Environment(width, height, rows, columns);
    env.setup();
  });

  document.getElementById('btnRepetir').addEventListener('click', () => {
    env.resetCurrentSearch();
  });

  document.getElementById('algoSelect').addEventListener('change', () => {
    env.resetCurrentSearch();
  });

  let isPaused = false;
  document.getElementById('btnPlayPause').addEventListener('click', (e) => {
    isPaused = !isPaused;
    if (isPaused) {
      noLoop();
      e.target.innerText = "▶ Retomar Simulação";
      e.target.style.backgroundColor = "#ff9800";
    } else {
      loop();
      e.target.innerText = "Pausar Simulação";
      e.target.style.backgroundColor = "#4CAF50";
    }
  });
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

  updateUI();
}

let lastFood = -1;
let lastTime = -1;
let lastCost = -1;

function updateUI() {
  if (env.foodCount !== lastFood) {
    document.getElementById('foodScore').innerText = env.foodCount;
    lastFood = env.foodCount;
  }

  if (env.iterations !== lastTime) {
    document.getElementById('timeScore').innerText = env.iterations;
    lastTime = env.iterations;
  }

  if (!env.isSearching && env.currentSearch && env.currentSearch.isFinished) {
    let totalCost = 0;
    for (let p of env.currentSearch.finalPath) {
      totalCost += env.walkable[p.x][p.y].cost;
    }

    if (totalCost !== lastCost) {
      document.getElementById('pathCost').innerText = totalCost;
      lastCost = totalCost;
    }
  } else if (env.isSearching && lastCost !== "...") {
    document.getElementById('pathCost').innerText = "...";
    lastCost = "...";
  }
}
