window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const centerX = 360;
  const centerY = 240;
  const shipWidth = 20;
  const shipHeight = 30;

  drawSectors(ctx, centerX, centerY);
  drawShip(ctx, centerX, centerY, shipWidth, shipHeight);
});

function drawSectors(ctx, centerX, centerY) {
  ctx.strokeStyle = 'white';
  const length = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
  const factorA = Math.cos(Math.PI / 8);
  const factorB = Math.sin(Math.PI / 8);

  for (let i = 0, sectors = 8; i < sectors; ++i) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + length * (i % 2 ? factorA : factorB) * (i < 4 ? -1 : 1),
               centerY + length * (i % 2 ? factorB : factorA) * (i % 4 < 2 ? -1 : 1));
    ctx.closePath();
    ctx.stroke();
  }
}

function drawShip(ctx, centerX, centerY, width, height) {
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - height / 2);
  ctx.lineTo(centerX + width / 2, centerY + height / 2);
  ctx.lineTo(centerX, centerY + height / 4);
  ctx.lineTo(centerX - width / 2, centerY + height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}