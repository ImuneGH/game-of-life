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
