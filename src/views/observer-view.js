import View from './view';
import Matrix from '../math/matrix';

export default class ObserverView extends View {
  constructor(canvas) {
    super(canvas);
  }

  update(gameState) {
    super.update(gameState);
    const transform = this.createCoordinateTransform(gameState.size);
    gameState.shots.forEach(shot => this.drawShot(shot.position, transform));
    gameState.ships.forEach(ship => this.drawShip(ship.position, ship.heading, ship.thrust, transform));
  }

  createCoordinateTransform(gameSize) {
    const scaling = new Matrix(2, 1, [
      this.canvas.width / gameSize.element(1),
      this.canvas.height / gameSize.element(2)
    ]);
    const invertY = new Matrix(2, 1, [1, -1]);
    const shiftOrigin = new Matrix(2, 1, [
      this.canvas.width / 2,
      this.canvas.height / 2
    ]);
    return point => Matrix.add(Matrix.entrywiseProduct(Matrix.entrywiseProduct(point, scaling), invertY), shiftOrigin);
  }

  drawShip(center, heading, thrust, transform) {
    const ship = [
      new Matrix(2, 1, [15, 0]),
      new Matrix(2, 1, [-15, -10]),
      new Matrix(2, 1, [-10, 0]),
      new Matrix(2, 1, [-15, 10])
    ];
    const engine = [
      new Matrix(2, 1, [-12.5, -5]),
      new Matrix(2, 1, [-20, 0]),
      new Matrix(2, 1, [-12.5, 5])
    ];
    const rotation = new Matrix(2, 2, [
      Math.cos(heading), -1 * Math.sin(heading),
      Math.sin(heading), Math.cos(heading)
    ]);
    const enginePoints = engine.map(point => Matrix.add(Matrix.multiply(rotation, point), center));
    const shipPoints = ship.map(point => Matrix.add(Matrix.multiply(rotation, point), center));
    
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'white';
    if (thrust) {
      this.ctx.beginPath();
      enginePoints.forEach((point, i) => {
        const canvasPoint = transform(point);
        this.ctx[i === 0 ? 'moveTo' : 'lineTo'](canvasPoint.element(1), canvasPoint.element(2));
      });
      this.ctx.stroke();
    }
    this.ctx.beginPath();
    shipPoints.forEach((point, i) => {
      const canvasPoint = transform(point);
      this.ctx[i === 0 ? 'moveTo' : 'lineTo'](canvasPoint.element(1), canvasPoint.element(2));
    });
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawShot(position, transform) {
    const point = transform(position);

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(point.element(1), point.element(2), 1, 1);
  }
}