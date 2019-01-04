export default class ShipState {
  constructor(state) {
    const { position, velocity, heading } = state;
    this.position = position;
    this.velocity = velocity;
    this.heading = heading;
  }

  tickPosition(interval) {
    const angle = 2 * Math.PI * this.velocity.heading;
    const newPosition = {
      x: this.position.x + this.velocity.speed * interval * Math.sin(angle),
      y: this.position.y + this.velocity.speed * interval * Math.cos(angle)
    };
    this.position = {
      x: newPosition.x >= 0 ? newPosition.x % 1 : 1 + newPosition.x,
      y: newPosition.y >= 0 ? newPosition.y % 1 : 1 + newPosition.y
    };
  }
}