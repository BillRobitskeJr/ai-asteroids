export default class Player {
  constructor(state) {
    const { shipState } = state;
    this.shipState = shipState;

    this.rotationSpeed = 1;
    this.thrustMagnitude = 1;
    this.hyperspaceCharge = 0;
    this.hyperspaceChargeRate = 1;

    this.keyFlags = {
      turnRight: false,
      turnLeft: false,
      thrust: false,
      shoot: false,
      hyperspaceJump: false
    };
  }

  takeAction(interval) {
    if (this.hyperspaceCharge < 1) this.hyperspaceCharge += this.hyperspaceChargeRate * interval;

    if (this.keyFlags.turnLeft && !this.keyFlags.turnRight) this.turnLeft(interval);
    if (this.keyFlags.turnRight && !this.keyFlags.turnLeft) this.turnRight(interval);
    if (this.keyFlags.hyperspaceJump) this.hyperspaceJump(interval);
    if (this.keyFlags.thrust) this.thrust(interval);
    if (this.keyFlags.shoot) this.shoot(interval);
  }

  turnLeft(interval) {
    const newHeading = this.shipState.heading + this.rotationSpeed * interval;
    this.shipState.heading = newHeading >= 0 ? newHeading % 1 : 1 + newHeading;
  }

  turnRight(interval) {
    const newHeading = this.shipState.heading - this.rotationSpeed * interval;
    this.shipState.heading = newHeading >= 0 ? newHeading % 1 : 1 + newHeading;
  }

  thrust(interval) {
    const lorenzFactor = 1 / Math.sqrt(1 - Math.pow(this.shipState.velocity.speed, 2));
    const time = interval / lorenzFactor;
    const velocity = {
      x: this.shipState.velocity.speed * Math.sin(2 * Math.PI * this.shipState.velocity.heading),
      y: this.shipState.velocity.speed * Math.cos(2 * Math.PI * this.shipState.velocity.heading)
    };
    const acceleration = {
      x: this.thrustMagnitude * Math.sin(2 * Math.PI * this.shipState.heading),
      y: this.thrustMagnitude * Math.cos(2 * Math.PI * this.shipState.heading)
    };
    const newVelocity = {
      x: velocity.x + acceleration.x * time,
      y: velocity.y + acceleration.y * time
    };
    const heading = Math.atan(newVelocity.x / newVelocity.y) / Math.PI / 2;
    // console.log(velocity, time, acceleration, newVelocity);
    console.log(this.shipState.heading, heading, newVelocity);
    // this.shipState.velocity = {
    //   speed: Math.sqrt(Math.pow(newVelocity.x, 2) + Math.pow(newVelocity.y, 2)),
    //   heading: Math.atan(newVelocity.y / newVelocity.x) / Math.PI
    // };
  }

  shoot(interval) {

  }

  hyperspaceJump(interval) {
    if (this.hyperspaceCharge < 1) return;
    this.shipState.position = {
      x: Math.random(),
      y: Math.random()
    };
    this.hyperspaceCharge--;
  }
}