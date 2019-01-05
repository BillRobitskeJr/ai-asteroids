import Matrix from '../math/matrix';

export default class ShipState {
  constructor(gameState) {
    this.gameState = gameState;
    this.position = new Matrix(2, 1);
    this.velocity = new Matrix(2, 1);
    this.heading = heading || 0;
    this.thrust = thrust || 0;
  }

  update(interval) {
    if (this.thrust > 0) {
      const acceleration = new Matrix(2, 1, [
        this.thrust * Math.cos(this.heading),
        this.thrust * Math.sin(this.heading)
      ]);
      this.velocity = Matrix.add(this.velocity, acceleration.scale(interval));
    }
    this.position = this.gameState.normalizePoint(Matrix.add(this.position, this.velocity.scale(interval)));
  }
}