import Entity from './entity';
import Matrix from '../math/matrix';

const BASE_MASS = 1;

export default class ShotEntity extends Entity {
  constructor(details) {
    const {
      mass,
      position,
      velocity
    } = details;
    super({
      radius: 1,
      mass: mass || BASE_MASS,
      position,
      velocity
    });
  }

  getShape() {
    return super.getShape([
      new Matrix(2, 1, [0, 0]),
      new Matrix(2, 1, [1, 0]),
      new Matrix(2, 1, [1, 1]),
      new Matrix(2, 1, [0, 1])
    ]);
  }

  break() {
    return [];
  }
}