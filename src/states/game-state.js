import ShipState from './ship-state';
import Matrix from '../math/matrix';

export default class GameState {
  constructor(width, height) {
    this.size = new Matrix(2, 1, [width || 100, height || 100]);
    this.ships = [];
  }

  addShip(shipState) {
    this.ships.push(new ShipState(this));
    return shipState;
  }

  update(interval) {
    this.ships.forEach(ship => {
      ship.update(interval);
    });
  }

  normalizePoint(point) {
    const adjustments = Matrix.entrywiseProduct(new Matrix(2, 1, [
      Math.abs(point.element(1)) <= this.size.element(1) / 2
        ? 0
        : point.element(1) < 0
          ? 1
          : -1,
      Math.abs(point.element(2)) <= this.size.element(2) / 2
        ? 0
        : point.element(2) < 0
          ? 1
          : -1
    ]), this.size);
    return Matrix.add(point, adjustments);
  }
}