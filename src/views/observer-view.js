import View from './view';

export default class ObserverView extends View {
  constructor(ctx, width, height) {
    super(ctx, width, height);
  }

  update(gameState) {
    super.update(gameState);
    gameState.ships.forEach(ship => this.drawShip(ship, gameState.size));
  }

  drawShip(shipState, size) {
    const center = {
      x: size.width * shipState.position.x,
      y: size.height * shipState.position.y
    };
    const heading = 2 * Math.PI * shipState.heading;
    const rotate = {
      x: (x, y) => x * Math.cos(heading) + y * Math.sin(heading),
      y: (x, y) => y * Math.cos(heading) - x * Math.sin(heading)
    }

    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.moveTo(center.x + rotate.x(0, -15), center.y + rotate.y(0, -15));
    this.ctx.lineTo(center.x + rotate.x(10, 15), center.y + rotate.y(10, 15));
    this.ctx.lineTo(center.x + rotate.x(0, 10), center.y + rotate.y(0, 10));
    this.ctx.lineTo(center.x + rotate.x(-10, 15), center.y + rotate.y(-10, 15));
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}