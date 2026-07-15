//*******************
// functions
//*******************

function neighborCount(i, j) {
  let count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      if (i + x < 0 || i + x >= gridSize || j + y < 0 || j + y >= gridSize) continue;
      count += grid[i + x][j + y];
    }
  }
  return count;
}

function updateCell(i, j) {
  const neighbors = neighborCount(i, j);
  if (grid[i][j] === 1) {
    newGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
    newGrid[i][j] === 0 && aliveCount--;
  } else {
    newGrid[i][j] = neighbors === 3 ? 1 : 0;
    newGrid[i][j] === 1 && aliveCount++;
  }
}

function fillCell(i, j) {
  if (isRunning) {
    ctx.fillStyle = newGrid[i][j] === 1 ? aliveCellColor : deadCellColor;
  } else {
    ctx.fillStyle = grid[i][j] === 1 ? aliveCellColor : deadCellColor;
  }
  ctx.fillRect(j * 10, i * 10, 9, 9);
}

function toggleCell(e) {
  if (!e) return;
  let x = e.offsetX;
  let y = e.offsetY;
  let col = Math.floor(x / 10);
  let row = Math.floor(y / 10);
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
  if (row === lastToggledRow && col === lastToggledCol) return;
  grid[row][col] = grid[row][col] === 1 ? 0 : 1;
  fillCell(row, col);
  if (grid[row][col] === 1) {
    aliveCount++;
  } else {
    aliveCount--;
  }

  aliveCounter.textContent = aliveCount;
  lastToggledCol = col;
  lastToggledRow = row;
}

function startGame() {
  isRunning = true;
  currentPhase = GAMEPHASE.RUNNING;
  phaseUpdate();
  canvas.removeEventListener("pointerdown", pointerDownHandler);
  gameInterval = setInterval(() => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        updateCell(i, j);
        fillCell(i, j);
      }
    }
    generation++;
    updateCounters();
    [grid, newGrid] = [newGrid, grid];
  }, speed);
}

function updateCounters() {
  generationCounter.textContent = generation;
  aliveCounter.textContent = aliveCount;
}

function phaseUpdate() {
  switch (currentPhase) {
    case GAMEPHASE.SETUP:
      gameStatus.textContent = "Myší vyberte buňky a stiskněte Start pro spuštění simulace.";
      break;
    case GAMEPHASE.RUNNING:
      gameStatus.textContent = "Simulace běží. Stiskněte Stop pro pozastavení nebo Reset pro restartování.";
      break;
    case GAMEPHASE.STOPPED:
      gameStatus.textContent = "Hra je pozastavena. Stiskněte Start pro pokračování nebo Reset pro restartování.";
      break;
  }
}

function pointerDownHandler(e) {
  if (pointerId !== null) return;
  pointerId = e.pointerId;
  toggleCell(e);
  canvas.addEventListener("pointermove", pointerMoveHandler);
  window.addEventListener("pointerup", pointerUpHandler);
}

function pointerMoveHandler(e) {
  toggleCell(e);
}

function pointerUpHandler() {
  canvas.removeEventListener("pointermove", pointerMoveHandler);
  window.removeEventListener("pointerup", pointerUpHandler);
  lastToggledCol = null;
  lastToggledRow = null;
  pointerId = null;
}

function updateSpeed() {
  speed = speedRange.value * 1000;
  if (isRunning) {
    clearInterval(gameInterval);
    startGame();
  }
}

function closeRulesDialog(e) {
  const rect = rulesDialog.getBoundingClientRect();
  if ((e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) && e.target !== rulesButton) {
    rulesDialog.close();
    document.removeEventListener("click", closeRulesDialog);
  }
}

//*******************
// main program
//*******************

const deadCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--dead-cell");
const aliveCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--alive-cell");
const startButton = document.querySelector(".start-btn");
const stopButton = document.querySelector(".stop-btn");
const resetButton = document.querySelector(".reset-btn");
const generationCounter = document.querySelector(".generation");
const aliveCounter = document.querySelector(".alive-cells");
const gameStatus = document.querySelector(".game-status");
let isRunning = false;
let gameInterval = null;
let generation = 0;
let aliveCount = 0;
let pointerId = null;
const GAMEPHASE = Object.freeze({
  SETUP: "setup",
  RUNNING: "running",
  STOPPED: "stopped",
});
let currentPhase = GAMEPHASE.SETUP;
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
let grid = [];
let newGrid = [];
let lastToggledRow = null;
let lastToggledCol = null;
const isMobile = window.innerWidth <= 600;
let gridSize = isMobile ? 30 : 50;
let speed = 1000;

if (!canvas.getContext) {
  alert("Your browser does not support canvas!");
}

if (isMobile) {
  canvas.width = 300;
  canvas.height = 300;
}

for (let i = 0; i < gridSize; i++) {
  grid[i] = [];
  newGrid[i] = [];
  for (let j = 0; j < gridSize; j++) {
    grid[i][j] = 0;
    newGrid[i][j] = 0;
    fillCell(i, j);
  }
}

phaseUpdate();
canvas.addEventListener("pointerdown", pointerDownHandler);

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", () => {
  clearInterval(gameInterval);
  isRunning = false;
  currentPhase = GAMEPHASE.STOPPED;
  phaseUpdate();
});
resetButton.addEventListener("click", () => {
  aliveCount = 0;
  generation = 0;
  updateCounters();
  clearInterval(gameInterval);
  isRunning = false;
  currentPhase = GAMEPHASE.SETUP;
  phaseUpdate();
  for (let i = 0; i < gridSize; i++) {
    grid[i] = grid[i] || [];
    newGrid[i] = newGrid[i] || [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = 0;
      newGrid[i][j] = 0;
      fillCell(i, j);
    }
  }
  canvas.addEventListener("pointerdown", pointerDownHandler);
});

// rules modal

const rulesButton = document.querySelector(".rules");
const rulesDialog = document.querySelector(".rules-dialog");

rulesButton.addEventListener("click", () => {
  console.log("Opening rules dialog");
  rulesDialog.showModal();
  document.addEventListener("click", closeRulesDialog);
});

rulesDialog.addEventListener("close", (e) => {
  if (e.target === rulesDialog) {
    document.removeEventListener("click", closeRulesDialog);
  }
});

// speed range

const speedRange = document.querySelector(".speed-range");
const speedValue = document.querySelector(".speed-value");

speedRange.addEventListener("input", () => {
  speedValue.textContent = speedRange.value;
  speedRange.removeEventListener("change", updateSpeed);
  speedRange.addEventListener("change", updateSpeed);
});

// mobile version

window.addEventListener("resize", () => {
  if (window.innerWidth <= 600 && gridSize !== 30) {
    gridSize = 30;
    canvas.width = 300;
    canvas.height = 300;
    resetButton.click();
  } else if (window.innerWidth > 600 && gridSize !== 50) {
    gridSize = 50;
    canvas.width = 500;
    canvas.height = 500;
    resetButton.click();
  }
});
