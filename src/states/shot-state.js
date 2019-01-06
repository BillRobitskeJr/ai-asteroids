import Matrix from '../math/matrix';

export default class ShotState {
  constructor(gameState, state) {
    const { position, velocity } = state;
    this.gameState = gameState;
    this.position = position;
    this.velocity = velocity;
  }

  update(interval) {
    const position = Matrix.add(this.position, this.velocity.scale(interval));
    this.position = this.gameState.normalizePoint(position);
  }
}