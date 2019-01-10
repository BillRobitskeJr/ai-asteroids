import View from './view';
import Matrix from '../math/matrix';

export default class ObserverView extends View {
  constructor(canvas) {
    super(canvas);
  }

  update(gameState) {
    super.update(gameState);
    const transform = this.createCoordinateTransform(gameState.size);
    gameState.entities.forEach(entity => this.drawEntity(entity, transform));
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

  drawEntity(entity, transform) {
    const points = entity.getShape();

    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    points.forEach((point, i) => {
      const canvasPoint = transform(point);
      this.ctx[i === 0 ? 'moveTo' : 'lineTo'](canvasPoint.element(1), canvasPoint.element(2));
    });
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}