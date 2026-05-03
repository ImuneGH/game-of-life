// functions

function neighborCount(i, j) {
  const count = 0;
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

// main program

const deadCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--dead-cell");
const aliveCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--alive-cell");
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const grid = [];

for (let i = 0; i < 50; i++) {
  grid[i] = [];
  for (let j = 0; j < 50; j++) {
    grid[i][j] = Math.random() > 0.5 ? 1 : 0;
    ctx.fillStyle = grid[i][j] === 1 ? aliveCellColor : deadCellColor;
    ctx.beginPath();
    ctx.roundRect(i * 10, j * 10, 9, 9, 2);
    ctx.fill();
  }
}

console.log(deadCellColor, aliveCellColor, grid);

for (let i = 0; i < 50; i++) {
  for (let j = 0; j < 50; j++) {
    updateCell(i, j);
    ctx.fillStyle = grid[i][j] === 1 ? aliveCellColor : deadCellColor;
    ctx.beginPath();
    ctx.roundRect(i * 10, j * 10, 9, 9, 2);
    ctx.fill();
  }
}
