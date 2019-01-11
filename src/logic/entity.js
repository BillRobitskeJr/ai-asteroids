import Matrix from "../math/matrix";

const SHAPE_POINTS = 12;

export default class Entity {
  constructor(details) {
    const {
      mass,
      radius,
      position,
      velocity,
      angle,
      angularVelocity
    } = details;
    this.mass = mass || 1;
    this.radius = radius || 1;
    this.position = position || new Matrix(2, 1);
    this.velocity = velocity || new Matrix(2, 1);
    this.angle = angle || 0;
    this.angularVelocity = angularVelocity || 0;
  }

  get linearMomentum() {
    return this.velocity.scale(this.mass);
  }

  set linearMomentum(momentum) {
    if (isNaN(momentum.element(1)) || isNaN(momentum.element(2))) return console.error(`Invalid Linear Momenum:`, this, momentum);
    this.velocity = momentum.scale(1 / this.mass);
  }

  get angularMomentum() {
    return (this.mass * Math.pow(this.radius, 2) / 2) * this.angularVelocity;
  }

  set angularMomentum(momentum) {
    if (isNaN(momentum)) return console.error(`Invalid Angular Momentum:`, this, momentum);
    this.angularVelocity = momentum / (this.mass * Math.pow(this.radius, 2) / 2);
  }

  getShape(basePoints) {
    if (!basePoints) {
      const arc = 2 * Math.PI / SHAPE_POINTS;
      basePoints = Array(SHAPE_POINTS).fill(0).map((x, i) => new Matrix(2, 1, [
        Math.cos(arc * i),
        Math.sin(arc * i)
      ]));
    }
    const rotation = new Matrix(2, 2, [
      Math.cos(this.angle), -1 * Math.sin(this.angle),
      Math.sin(this.angle), Math.cos(this.angle)
    ]);
    return basePoints.map(point => Matrix.add(Matrix.multiply(rotation, point.scale(this.radius)), this.position));
  }

  break() {
    return [this];
  }
}