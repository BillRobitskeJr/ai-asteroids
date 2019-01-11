import Entity from './entity';
import Matrix from '../math/matrix';
import gaussianRandom from '../math/gaussian-random';

const AVG_DENSITY = 2;
const BASE_RADIUS = 40;
const MIN_RADIUS = 10;
const SHAPE_POINTS = 10;

export default class AsteroidEntity extends Entity {
  constructor(details) {
    const {
      radius,
      mass,
      position,
      velocity,
      angle,
      angularVelocity
    } = details;
    super({
      radius: radius || (mass ? Math.sqrt(mass / AVG_DENSITY / Math.PI) : BASE_RADIUS),
      mass: mass || (AVG_DENSITY * Math.PI * Math.pow(radius || BASE_RADIUS, 2)),
      position,
      velocity,
      angle,
      angularVelocity
    });
    this.points = AsteroidEntity.createBasePoints();
  }

  static createBasePoints() {
    const arc = 2 * Math.PI / SHAPE_POINTS;
    const angles = Array(SHAPE_POINTS)
      .fill(0).map((x, i) => gaussianRandom(arc * i, arc / 2))
      .sort((a, b) => a - b);
    return angles.map(angle => {
      const pointRadius = gaussianRandom(1, 0.1);
      return new Matrix(2, 1, [
        pointRadius * Math.cos(angle),
        pointRadius * Math.sin(angle)
      ]);
    });
  }

  getShape() {
    return super.getShape(this.points);
  }

  break() {
    return [this];
    const ratio = Math.min(Math.max(gaussianRandom(0.5, 0.1), 0), 1);
    const angle = Math.random() * 2 * Math.PI;
    const frag1 = new AsteroidEntity({
      mass: this.mass * ratio,
      position: Matrix.add(this.position, new Matrix(2, 1, [
        this.radius * Math.cos(angle),
        this.radius * Math.sin(angle)
      ])),
      angle: this.angle
    });
    frag1.linearMomentum = this.linearMomentum.scale(ratio);
    frag1.angularMomentum = this.angularMomentum * ratio;
    const frag2 = new AsteroidEntity({
      mass: this.mass * (1 - ratio),
      position: Matrix.add(this.position, new Matrix(2, 1, [
        this.radius * Math.cos(angle + Math.PI),
        this.radius * Math.sin(angle + Math.PI)
      ])),
      angle: this.angle
    });
    frag2.linearMomentum = this.linearMomentum.scale(1 - ratio);
    frag2.angularMomentum = this.angularMomentum * (1 - ratio);
    const fragments = [];
    // console.log(`${this.radius} => ${frag1.radius} & ${frag2.radius}`);
    if (frag1.radius > MIN_RADIUS) fragments.push(frag1);
    if (frag2.radius > MIN_RADIUS) fragments.push(frag2);
    return fragments;
  }
}