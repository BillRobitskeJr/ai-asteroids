export default class Player {
  constructor(state) {
    const { shipState } = state;
    this.shipState = shipState;

    this.rotationSpeed = 2 * Math.PI;
    this.thrustMagnitude = 100;
    this.hyperspaceCharge = 0;
    this.hyperspaceChargeRate = 1;
    this.shotSpeed = 200;

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
    this.shipState.gameState.addShot(this.shipState, this.shotSpeed);
  }

  hyperspaceJump(interval) {
    if (this.hyperspaceCharge < 1) return;
    this.shipState.position = this.shipState.gameState.getRandomPosition();
    this.hyperspaceCharge--;
  }
}