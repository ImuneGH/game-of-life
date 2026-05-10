//*******************
// functions
//*******************

function neighborCount(i, j) {
  let count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      if (i + x < 0 || i + x >= 50 || j + y < 0 || j + y >= 50) continue;
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
  ctx.beginPath();
  ctx.roundRect(j * 10, i * 10, 9, 9, 2);
  ctx.fill();
}

function toggleCell(e) {
  let x = e.offsetX;
  let y = e.offsetY;
  let col = Math.floor(x / 10);
  let row = Math.floor(y / 10);
  grid[row][col] = grid[row][col] === 1 ? 0 : 1;
  fillCell(row, col);
  if (grid[row][col] === 1) {
    aliveCount++;
  } else {
    aliveCount--;
  }
  aliveCounter.textContent = aliveCount;
}

function startGame() {
  isRunning = true;
  currentPhase = GAMEPHASE.RUNNING;
  phaseUpdate();
  canvas.removeEventListener("click", toggleCell);
  gameInterval = setInterval(() => {
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        updateCell(i, j);
        fillCell(i, j);
      }
    }
    generation++;
    updateCounters();
    [grid, newGrid] = [newGrid, grid];
  }, 1000);
}

function updateCounters() {
  generationCounter.textContent = generation;
  aliveCounter.textContent = aliveCount;
}

function phaseUpdate() {
  switch (currentPhase) {
    case GAMEPHASE.SETUP:
      gameStatus.textContent = "Fáze 1: Myší vyberte buňky a stiskněte Start pro spuštění simulace.";
      break;
    case GAMEPHASE.RUNNING:
      gameStatus.textContent = "Fáze 2: Simulace běží. Stiskněte Stop pro pozastavení nebo Reset pro restartování.";
      break;
    case GAMEPHASE.STOPPED:
      gameStatus.textContent = "Fáze 3: Hra je pozastavena. Stiskněte Start pro pokračování nebo Reset pro restartování.";
      break;
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

if (!canvas.getContext) {
  alert("Your browser does not support canvas!");
}

for (let i = 0; i < 50; i++) {
  grid[i] = [];
  newGrid[i] = [];
  for (let j = 0; j < 50; j++) {
    grid[i][j] = 0;
    newGrid[i][j] = 0;
    fillCell(i, j);
  }
}

phaseUpdate();
canvas.addEventListener("click", toggleCell);

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
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      grid[i][j] = 0;
      newGrid[i][j] = 0;
      fillCell(i, j);
    }
  }
  canvas.addEventListener("click", toggleCell);
});
