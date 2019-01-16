import Matrix from '../math/matrix';
import ShipEntity from '../logic/ship-entity';
import Physics from '../logic/physics';
import AsteroidEntity from '../logic/asteroid-entity';
import ShotEntity from '../logic/shot-entity';

export default class GameState {
  constructor(state) {
    const { size } = state;
    this.asteroidInterval = 1;
    this.asteroidDelay = 0;
    this.asteroidLimit = 3;
    this.size = new Matrix(2, 1, size || [100, 100]);
    this.physics = new Physics({
      spaceSize: new Matrix(2, 1, size || [100, 100])
    });
    this.entities = [];
  }

  addShip() {
    const ship = new ShipEntity({
      position: this.getRandomPosition(),
      velocity: this.getRandomVelocity(),
      angle: Math.random() * 2 * Math.PI
    });
    this.entities.push(ship);
    return ship;
  }

  addShot(fromShip, speed) {
    if (!fromShip.isAlive) return null;
    const velocity = new Matrix(2, 1, [
      speed * Math.cos(fromShip.angle),
      speed * Math.sin(fromShip.angle)
    ]);
    const point = fromShip.getShape()[0];
    const shot = new ShotEntity({
      position: point,
      velocity: Matrix.add(velocity, fromShip.velocity)
    });
    this.entities.push(shot);
    return shot;
  }

  addAsteroid() {
    const asteroid = new AsteroidEntity({
      radius: 40,
      position: this.getRandomPosition(),
      velocity: this.getRandomVelocity().scale(0.5),
      angle: Math.random() * 2 * Math.PI,
      angularVelocity: Math.random() * Math.PI
    });
    this.entities.push(asteroid);
    return asteroid;
  }

  update(interval) {
    this.asteroidDelay += interval;
    const asteroids = this.entities.filter(entity => entity instanceof AsteroidEntity);
    if (asteroids.length < this.asteroidLimit && this.asteroidDelay >= this.asteroidInterval) {
      this.addAsteroid();
      this.asteroidDelay = 0;
    }

    this.entities = this.physics.update(this.entities, interval);
  }

  getRandomPosition() {
    const point = new Matrix(2, 1, [Math.random(), Math.random()]);
    const origin = new Matrix(2, 1, [
      this.physics.spaceSize.element(1) / -2,
      this.physics.spaceSize.element(2) / -2
    ]);
    return Matrix.add(Matrix.entrywiseProduct(point, this.physics.spaceSize), origin);
  }

  getRandomVelocity() {
    const speed = Math.random() * Math.min(this.physics.spaceSize.element(1), this.physics.spaceSize.element(2)) / 2;
    const angle = Math.random() * 2 * Math.PI;
    return new Matrix(2, 1, [
      speed * Math.cos(angle),
      speed * Math.sin(angle)
    ]);
  }
}