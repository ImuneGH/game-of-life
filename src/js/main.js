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
    grid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
  } else {
    grid[i][j] = neighbors === 3 ? 1 : 0;
  }
}

function fillCell(i, j) {
  ctx.fillStyle = grid[i][j] === 1 ? aliveCellColor : deadCellColor;
  ctx.beginPath();
  ctx.roundRect(i * 10, j * 10, 9, 9, 2);
  ctx.fill();
}

function toggleCell(e) {
  let x = e.offsetX;
  let y = e.offsetY;
  let row = Math.floor(x / 10);
  let col = Math.floor(y / 10);
  grid[row][col] = grid[row][col] === 1 ? 0 : 1;
  fillCell(row, col);
}

function startGame() {
  canvas.removeEventListener("click", toggleCell);
  gameInterval = setInterval(() => {
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        updateCell(i, j);
        fillCell(i, j);
      }
    }
    console.log(gameInterval);
  }, 1000);
}

//*******************
// main program
//*******************

const deadCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--dead-cell");
const aliveCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--alive-cell");
const startButton = document.querySelector(".start-btn");
const stopButton = document.querySelector(".stop-btn");
const resetButton = document.querySelector(".reset-btn");
let gameInterval = null;
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
let grid = [];

if (!canvas.getContext) {
  alert("Your browser does not support canvas!");
}

for (let i = 0; i < 50; i++) {
  grid[i] = [];
  for (let j = 0; j < 50; j++) {
    grid[i][j] = 0;
    fillCell(i, j);
  }
}

canvas.addEventListener("click", toggleCell);

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", () => {
  clearInterval(gameInterval);
});
resetButton.addEventListener("click", () => {
  clearInterval(gameInterval);
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      grid[i][j] = 0;
      fillCell(i, j);
    }
  }
  canvas.addEventListener("click", toggleCell);
});
