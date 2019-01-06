export default class Player {
  constructor(state) {
    const { shipState } = state;
    this.shipState = shipState;
    console.log(this.shipState);

    this.rotationSpeed = 2 * Math.PI;
    this.thrustMagnitude = Math.min(this.shipState.gameState.size.element(1), this.shipState.gameState.size.element(2));
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
    console.log(this.keyFlags);
    if (this.hyperspaceCharge < 1) this.hyperspaceCharge += this.hyperspaceChargeRate * interval;

    if (this.keyFlags.turnLeft && !this.keyFlags.turnRight) this.turnLeft(interval);
    if (this.keyFlags.turnRight && !this.keyFlags.turnLeft) this.turnRight(interval);
    if (this.keyFlags.hyperspaceJump) this.hyperspaceJump(interval);
    if (this.keyFlags.thrust) {
      this.engageEngine(interval);
    } else {
      this.disengageEngine(interval);
    }
    if (this.keyFlags.shoot) this.shoot(interval);
  }

  turnLeft(interval) {
    const newHeading = this.shipState.heading + this.rotationSpeed * interval;
    this.shipState.heading = newHeading >= 0 ? newHeading % (2 * Math.PI) : 2 * Math.PI + newHeading;
  }

  turnRight(interval) {
    const newHeading = this.shipState.heading - this.rotationSpeed * interval;
    this.shipState.heading = newHeading >= 0 ? newHeading % (2 * Math.PI) : 2 * Math.PI + newHeading;
  }

  engageEngine(interval) {
    this.shipState.thrust = this.thrustMagnitude;
  }

  disengageEngine(interval) {
    this.shipState.thrust = 0;
  }

  shoot(interval) {

  }

  hyperspaceJump(interval) {
    if (this.hyperspaceCharge < 1) return;
    this.shipState.position = this.shipState.gameState.getRandomPosition();
    this.hyperspaceCharge--;
  }
}