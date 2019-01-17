const ROTATION_SPEED = 2 * Math.PI;
const THRUST_MAGNITUDE = 10000;
const SHOT_RECHARGE_TIME = 0.1;
const HYPERSPACE_RECHARGE_TIME = 1;
const SHOT_SPEED = 200;

export default class Player {
  constructor(state) {
    const { game, physics, ship } = state;
    this.game = game;
    this.physics = physics;
    this.ship = ship;
    this.fitness = 0;

    this.shotCharge = 0;
    this.hyperspaceCharge = 0;

    this.keyFlags = {
      turnRight: false,
      turnLeft: false,
      thrust: false,
      shoot: false,
      hyperspaceJump: false
    };
  }

  takeAction(interval) {
    this.shotCharge += interval;
    this.hyperspaceCharge += interval;

    if (!this.ship.isAlive) return;

    this.fitness += interval;
    console.log(`Player Fitness Score: ${this.fitness}`);
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
    const angle = this.ship.angle + ROTATION_SPEED * interval;
    this.ship.angle = this.physics.normalizeAngle(angle);
  }

  turnRight(interval) {
    const angle = this.ship.angle - ROTATION_SPEED * interval;
    this.ship.angle = this.physics.normalizeAngle(angle);
  }

  engageEngine(interval) {
    this.ship.thrust = THRUST_MAGNITUDE;
  }

  disengageEngine(interval) {
    this.ship.thrust = 0;
  }

  shoot(interval) {
    if (this.shotCharge < SHOT_RECHARGE_TIME) return;
    this.game.addShot(this.ship, SHOT_SPEED);
    this.shotCharge = 0;
  }

  hyperspaceJump(interval) {
    if (this.hyperspaceCharge < HYPERSPACE_RECHARGE_TIME) return;
    this.ship.position = this.game.getRandomPosition();
    this.hyperspaceCharge = 0;
  }
}