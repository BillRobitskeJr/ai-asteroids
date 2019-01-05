import View from './view';
import Matrix from '../math/matrix';

export default class ObserverView extends View {
  constructor(canvas) {
    super(canvas);
  }

  update(gameState) {
    super.update(gameState);
    const scaling = new Matrix(2, 1, [
      canvas.width / gameState.size.element(1),
      canvas.height / gameState.size.element(2)
    ]);
    gameState.ships.forEach(ship => this.drawShip(ship.position, ship.heading, scaling));
  }

  drawShip(center, heading, scaling) {
    const ship = [
      new Matrix(2, 1, [15, 0]),
      new Matrix(2, 1, [-15, -10]),
      new Matrix(2, 1, [-10, 0]),
      new Matrix(2, 1, [-15, 10])
    ];
    const rotation = new Matrix(2, 2, [
      Math.cos(heading), -1 * Math.sin(heading),
      Math.sin(heading), Math.cos(heading)
    ]);
    const points = Matrix.Matrix.multiply(rotation, ship);
    
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    points.forEach((point, i) => {
      
    });
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}