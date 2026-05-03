const deadCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--dead-cell");
const aliveCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--alive-cell");
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");

for (let i = 0; i < 500; i += 10) {
  for (let j = 0; j < 500; j += 10) {
    ctx.fillStyle = "var(--bg-color)";
    ctx.beginPath();
    ctx.roundRect(i, j, 9, 9, 2);
    ctx.fill();
  }
}

console.log(deadCellColor, aliveCellColor);
