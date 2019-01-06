import Matrix from '../math/matrix';

export default class ShipState {
  constructor(gameState, state) {
    const { position, velocity, heading } = state;
    this.gameState = gameState;
    this.position = position || new Matrix(2, 1);
    this.velocity = velocity || new Matrix(2, 1);
    this.heading = heading || 0;
    this.thrust = 0;
  }

  update(interval) {
    if (this.thrust > 0) {
      const acceleration = new Matrix(2, 1, [
        this.thrust * Math.cos(this.heading),
        this.thrust * Math.sin(this.heading)
      ]);
      console.log(`Acceleration: (${acceleration.element(1)}, ${acceleration.element(2)})`);
      this.velocity = Matrix.add(this.velocity, acceleration.scale(interval));
    }
    console.log(`Velocity: (${this.velocity.element(1)}, ${this.velocity.element(2)})`);
    this.position = this.gameState.normalizePoint(Matrix.add(this.position, this.velocity.scale(interval)));
    console.log(`Position: (${this.position.element(1)}, ${this.position.element(2)})`);
  }
}