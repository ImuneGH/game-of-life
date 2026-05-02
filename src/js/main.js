const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");

for (let i = 0; i < 500; i += 10) {
  for (let j = 0; j < 500; j += 10) {
    ctx.fillStyle = "var(--bg-color)";
    ctx.lineDashOffset = 4;
    ctx.fillRect(i, j, 9, 9);
  }
}
