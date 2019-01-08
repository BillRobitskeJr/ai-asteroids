import Matrix from '../math/matrix';
import gaussianRandom from '../math/gaussian-random';

export default class AsteroidState {
  constructor(gameState, state) {
    this.gameState = gameState;
    const {
      radius,
      position,
      velocity,
      angle,
      angularVelocity
    } = state;
    this.radius = radius || 50;
    this.position = position || new Matrix(2, 1);
    this.velocity = velocity || new Matrix(2, 1);
    this.angle = angle || 0;
    this.angularVelocity = angularVelocity || 0;
    this.points = AsteroidState.createPoints(this.radius);
  }

  update(time) {
    const newPosition = Matrix.add(this.position, this.velocity.scale(time));
    const newAngle = this.angle + this.angularVelocity * time;
    this.position = this.gameState.normalizePoint(newPosition);
    const maxAngle = 2 * Math.PI;
    this.angle = (newAngle < 0 ? maxAngle : 0) + (newAngle % maxAngle);
  }

  static createPoints(radius) {
    const arc = 2 * Math.PI / 10;
    const angles = Array(10).fill(0).map((x, i) => {
      return gaussianRandom(arc * i, arc / 2);
    }).sort();
    const variance = radius / 10;
    const points = angles.map(angle => {
      const pointRadius = gaussianRandom(radius, variance);
      return new Matrix(2, 1, [
        pointRadius * Math.cos(angle),
        pointRadius * Math.sin(angle)
      ]);
    });
    return points;
  }
}