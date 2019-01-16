import Entity from './entity';
import Matrix from '../math/matrix';
import { basename } from 'path';

const AVG_DENSITY = 0.101;
const BASE_RADIUS = 13;

export default class ShipEntity extends Entity {
  constructor(details) {
    const {
      radius,
      mass,
      position,
      velocity,
      angle,
      anglularVelocity
    } = details;
    super({
      radius: radius || BASE_RADIUS,
      mass: mass || (AVG_DENSITY * Math.PI * Math.pow(radius || BASE_RADIUS, 2)),
      position,
      velocity,
      angle,
      anglularVelocity
    });
    this.isAlive = true;
  }

  get thrust() {
    return (this.forces['thrust'] || new Matrix(2, 1)).vectorLength;
  }

  set thrust(value) {
    this.forces['thrust'] = new Matrix(2, 1, [
      value * Math.cos(this.angle),
      value * Math.sin(this.angle)
    ]);
  }

  getShape() {
    const points = [];
    points.push(
      new Matrix(2, 1, [15 / BASE_RADIUS, 0]),
      new Matrix(2, 1, [-15 / BASE_RADIUS, 10 / BASE_RADIUS]),
      new Matrix(2, 1, [-10 / BASE_RADIUS, 0])
    );
    if (this.thrust > 0) points.push(
      new Matrix(2, 1, [-12.5 / BASE_RADIUS, 5 / BASE_RADIUS]),
      new Matrix(2, 1, [-20 / BASE_RADIUS, 0]),
      new Matrix(2, 1, [-12.5 / BASE_RADIUS, -5 / BASE_RADIUS]),
      new Matrix(2, 1, [-10 / BASE_RADIUS, 0])
    );
    points.push(
      new Matrix(2, 1, [-15 / BASE_RADIUS, -10 / BASE_RADIUS])
    );
    return super.getShape(points);
  }

  break() {
    this.isAlive = false;
    return [];
  }
}