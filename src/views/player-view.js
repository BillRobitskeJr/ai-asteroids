import View from './view';

export default class PlayerView extends View {
  constructor(canvas, shipState) {
    super(canvas);
    this.shipState = shipState;
  }

  update(gameState) {
    super.update(gameState);
    this.drawSectors();
    this.drawShip();
  }

  drawSectors() {
    const center = { x: this.width / 2, y: this.height / 2 };
    const length = Math.sqrt(Math.pow(center.x, 2) + Math.pow(center.y, 2));
    const factors = [Math.cos(Math.PI / 8), Math.sin(Math.PI / 8)];

    this.ctx.strokeStyle = 'white';
    for (let i = 0, sectors = 8; i < sectors; ++i) {
      this.ctx.beginPath();
      this.ctx.moveTo(center.x, center.y);
      this.ctx.lineTo(center.x + length * factors[i % 2 ? 0 : 1] * (i < 4 ? -1 : 1),
                      center.y + length * factors[i % 2 ? 1 : 0] * (i % 4 < 2 ? -1 : 1));
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  drawShip() {
    const center = { x: this.width / 2, y: this.height / 2 };

    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.moveTo(center.x, center.y - 15);
    this.ctx.lineTo(center.x + 10, center.y + 15);
    this.ctx.lineTo(center.x, center.y + 10);
    this.ctx.lineTo(center.x - 10, center.y + 15);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}