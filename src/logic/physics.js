import Matrix from "../math/matrix";
import { debug } from "util";

export default class Physics {
  constructor(details) {
    const { spaceSize } = details;
    this.spaceSize = spaceSize || new Matrix(2, 1, [100, 100]);
  }

  update(entities, time) {
    entities.forEach(entity => {
      const newPosition = Matrix.add(entity.position, entity.velocity.scale(time));
      const newAngle = entity.angle + entity.angularVelocity * time;
      entity.position = this.normalizePoint(newPosition);
      entity.angle = this.normalizeAngle(newAngle);
    });

    const collisions = this.findCollisions(entities);
    collisions.forEach(collision => {
      this.collide.apply(this, collision);
    });

    const collided = collisions.reduce((collided, collision) => {
      if (collided.indexOf(collision[0]) === -1) collided.push(collision[0]);
      if (collided.indexOf(collision[1]) === -1) collided.push(collision[1]);
      return collided;
    }, []);
    const noncollided = entities.filter(entity => collided.indexOf(entity) === -1);
    const postcollision = collided.reduce((entities, entity) => entities.concat(entity.break()), []);
    return noncollided.concat(postcollision);
  }

  findCollisions(entities) {
    return entities.reduce((collisions, entity, i) => {
      for (let j = i + 1; j < entities.length; ++j) {
        const impactor = entities[j];
        const distance = Matrix.vectorDistance(entity.position, impactor.position);
        if (distance < (entity.radius + impactor.radius))
          collisions.push([entity, impactor]);
      }
      return collisions;
    }, []);
  }

  collide(entity1, entity2) {
    const getMomentumChanges = (object, impactor) => {
      const velocity = Matrix.subtract(impactor.velocity, object.velocity);
      const distance = Matrix.vectorDistance(object.position, impactor.position);
      const rotAngle = Math.PI + (velocity.element(2) < 0 ? -1 : 1) * Math.asin((impactor.position.element(1) - object.position.element(1)) / distance);
      const rotation1 = new Matrix(2, 2, [
        Math.cos(rotAngle), -1 * Math.sin(rotAngle),
        Math.sin(rotAngle), Math.cos(rotAngle)
      ]);
      const rotation2 = new Matrix(2, 2, [
        Math.cos(-rotAngle), -1 * Math.sin(-rotAngle),
        Math.sin(-rotAngle), Math.cos(-rotAngle)
      ]);
      const momentum = Matrix.multiply(rotation1, velocity.scale(impactor.mass));
      return {
        object: {
          linear: Matrix.multiply(rotation2, new Matrix(2, 1, [0, momentum.element(2)])),
          angular: momentum.element(1)
        },
        impactor: {
          linear: Matrix.multiply(rotation2, new Matrix(2, 1, [0, momentum.element(2)])).scale(-1),
          angular: -momentum.element(1)
        }
      }
    };
    const applyMomentumDeltas = (entity, delta1, delta2) => {
      console.log(`Linear Momentum: ${entity.linearMomentum.toString()} + ${delta1.linear.toString()} + ${delta2.linear.toString()} = ${Matrix.add(entity.linearMomentum, Matrix.add(delta1.linear, delta2.linear)).toString()}`);
      entity.linearMomentum = Matrix.add(entity.linearMomentum, Matrix.add(delta1.linear, delta2.linear));
      entity.angularMomentum = entity.angularMomentum + delta1.angular + delta2.angular;
    };
    const { object: entity1delta1, impactor: entity2delta1 } = getMomentumChanges(entity1, entity2);
    const { object: entity2delta2, impactor: entity1delta2 } = getMomentumChanges(entity2, entity1);
    applyMomentumDeltas(entity1, entity1delta1, entity1delta2);
    applyMomentumDeltas(entity2, entity2delta1, entity2delta2);
  }

  normalizePoint(point) {
    const resetOrigin = Matrix.add(point, this.spaceSize.scale(0.5));
    const normalized = new Matrix(2, 1, [
      (resetOrigin.element(1) < 0 ? this.spaceSize.element(1) : 0) + (resetOrigin.element(1) % this.spaceSize.element(1)),
      (resetOrigin.element(2) < 0 ? this.spaceSize.element(2) : 0) + (resetOrigin.element(2) % this.spaceSize.element(2))
    ]);
    return Matrix.add(normalized, this.spaceSize.scale(-0.5));
  }

  normalizeAngle(angle) {
    const fullCircle = 2 * Math.PI;
    return (angle < 0 ? fullCircle : 0) + (angle % fullCircle);
  }
}