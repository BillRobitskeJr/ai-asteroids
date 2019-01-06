import ShipState from './ship-state';
import ShotState from './shot-state';
import Matrix from '../math/matrix';

export default class GameState {
  constructor(state) {
    const { size } = state;
    this.size = new Matrix(2, 1, size || [100, 100]);
    this.ships = [];
    this.shots = [];
  }

  addShip() {
    const shipState = new ShipState(this, {
      position: this.getRandomPosition(),
      velocity: this.getRandomVelocity(),
      heading: Math.random() * 2 * Math.PI
    });
    this.ships.push(shipState);
    return shipState;
  }

  addShot(fromShip, speed) {
    const rotation = new Matrix(2, 2, [
      Math.cos(fromShip.heading), -1 * Math.sin(fromShip.heading),
      Math.sin(fromShip.heading), Math.cos(fromShip.heading)
    ]);
    const velocity = new Matrix(2, 1, [
      speed * Math.cos(fromShip.heading),
      speed * Math.sin(fromShip.heading)
    ]);
    const shotState = new ShotState(this, {
      position: Matrix.add(fromShip.position,
                           Matrix.multiply(rotation,
                                           new Matrix(2, 1, [15, 0]))),
      velocity: Matrix.add(velocity, fromShip.velocity)
    });
    this.shots.push(shotState);
    return shotState;
  }

  update(interval) {
    this.shots.forEach(shot => { shot.update(interval); });
    this.ships.forEach(ship => { ship.update(interval); });
  }

  normalizePoint(point) {
    let adjustments = new Matrix(2, 1, [
      Math.abs(point.element(1)) <= this.size.element(1) / 2
        ? 0
        : (point.element(1) < 0
          ? 1
          : -1),
      Math.abs(point.element(2)) <= this.size.element(2) / 2
        ? 0
        : (point.element(2) < 0
          ? 1
          : -1)
    ]);
    adjustments = Matrix.entrywiseProduct(adjustments, this.size);
    return Matrix.add(point, adjustments);
  }

  getRandomPosition() {
    const point = new Matrix(2, 1, [Math.random(), Math.random()]);
    const origin = new Matrix(2, 1, [
      this.size.element(1) / -2,
      this.size.element(2) / -2
    ]);
    return Matrix.add(Matrix.entrywiseProduct(point, this.size), origin);
  }

  getRandomVelocity() {
    const speed = Math.random() * Math.min(this.size.element(1), this.size.element(2));
    const angle = Math.random() * 2 * Math.PI;
    return new Matrix(2, 1, [
      speed * Math.cos(angle),
      speed * Math.sin(angle)
    ]);
  }
}