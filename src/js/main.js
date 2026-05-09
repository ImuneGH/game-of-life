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

function toggleCell(i, j) {
  i = Math.floor(i / 10);
  j = Math.floor(j / 10);
  grid[i][j] = grid[i][j] === 1 ? 0 : 1;
}

//*******************
// main program
//*******************

const canvas = document.querySelector(".game-canvas");

if (canvas.getContext) {
  const deadCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--dead-cell");
  const aliveCellColor = window.getComputedStyle(document.documentElement).getPropertyValue("--alive-cell");
  const ctx = canvas.getContext("2d");
  let grid = [];

  for (let i = 0; i < 50; i++) {
    grid[i] = [];
    for (let j = 0; j < 50; j++) {
      grid[i][j] = 0;
      ctx.fillStyle = grid[i][j] === 1 ? aliveCellColor : deadCellColor;
      ctx.beginPath();
      ctx.roundRect(i * 10, j * 10, 9, 9, 2);
      ctx.fill();
    }
  }

  console.log(deadCellColor, aliveCellColor, grid);

  // setInterval(() => {
  canvas.addEventListener("click", (e) => {
    console.log(e.offsetX, e.offsetY);
    toggleCell(e.offsetX, e.offsetY);
  });
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      updateCell(i, j);
      ctx.fillStyle = grid[i][j] === 1 ? aliveCellColor : deadCellColor;
      ctx.beginPath();
      ctx.roundRect(i * 10, j * 10, 9, 9, 2);
      ctx.fill();
    }
  }
  // }, 1000);
} else {
  alert("Your browser does not support canvas!");
}
