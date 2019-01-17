import Matrix from "../math/matrix";
import AsteroidEntity from "./asteroid-entity";
import ShotEntity from "./shot-entity";

const GRAVITY_CONSTANT = 1;

export default class Physics {
  constructor(details) {
    const {
      spaceSize
    } = details;
    this.spaceSize = spaceSize || new Matrix(2, 1, [100, 100]);
  }

  update(entities, time) {
    this.applyGravityForces(entities);

    entities.forEach(entity => {
      const acceleration = Object.values(entity.forces)
        .reduce((sum, force) => Matrix.add(sum, force), new Matrix(2, 1))
        .scale(1 / entity.mass);
      const velocity = Matrix.add(entity.velocity, acceleration.scale(time));
      const position = Matrix.add(Matrix.add(entity.position, entity.velocity.scale(time)), acceleration.scale(Math.pow(time, 2) / 2));
      const angle = entity.angle + entity.angularVelocity * time;
      entity.position = this.normalizePoint(position);
      entity.velocity = velocity;
      entity.angle = this.normalizeAngle(angle);
    });

    const collisions = this.findCollisions(entities);
    collisions.forEach(collision => {
      this.collide.apply(this, collision);
    });

    const shotAsteroids = collisions.reduce((asteroids, collision) => {
      if (!(collision[0] instanceof ShotEntity) && !(collision[1] instanceof ShotEntity)) return asteroids;
      if (collision[0] instanceof AsteroidEntity &&
          asteroids.indexOf(collision[0]) === -1) asteroids.push(collision[0]);
      if (collision[1] instanceof AsteroidEntity &&
          asteroids.indexOf(collision[1]) === -1) asteroids.push(collision[1]);
      return asteroids;
    }, []);
    const collided = collisions.reduce((collided, collision) => {
      if (collided.indexOf(collision[0]) === -1) collided.push(collision[0]);
      if (collided.indexOf(collision[1]) === -1) collided.push(collision[1]);
      return collided;
    }, []);
    const fragile = collided.filter(entity => !(entity instanceof AsteroidEntity));
    console.log(fragile);
    const nonfragile = collided.filter(entity => fragile.indexOf(entity) === -1 && shotAsteroids.indexOf(entity) === -1);
    const noncollided = entities.filter(entity => collided.indexOf(entity) === -1);
    const postcollision = shotAsteroids.concat(fragile).reduce((entities, entity) => entities.concat(entity.break()), []);
    return noncollided.concat(nonfragile).concat(postcollision);
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
    const separation = Matrix.subtract(entity2.position, entity1.position);
    const distance = separation.vectorLength;
    const angle = Math.acos(separation.element(1) / distance) * (separation.element(2) < 0 ? -1 : 1);
    const rotation = new Matrix(2, 2, [
      Math.cos(-angle), -1 * Math.sin(-angle),
      Math.sin(-angle), Math.cos(-angle)
    ]);
    const velocity1initial = Matrix.multiply(rotation, entity1.velocity);
    const velocity2initial = Matrix.multiply(rotation, entity2.velocity);
    const cmVelocity = (entity1.mass * velocity1initial.element(1) + entity2.mass * velocity2initial.element(1)) / (entity1.mass * entity2.mass);
    const velocity1final = new Matrix(2, 1, [
      2 * cmVelocity - velocity1initial.element(1),
      velocity1initial.element(2)
    ]);
    const velocity2final = new Matrix(2, 1, [
      2 * cmVelocity - velocity2initial.element(1),
      velocity2initial.element(2)
    ]);
    const derotation = new Matrix(2, 2, [
      Math.cos(angle), -1 * Math.sin(angle),
      Math.sin(angle), Math.cos(angle)
    ]);
    entity1.velocity = Matrix.multiply(derotation, velocity1final);
    entity2.velocity = Matrix.multiply(derotation, velocity2final);
  }

  applyGravityForces(entities) {
    entities.forEach(entity1 => {
      const gravity = entities.reduce((gravity, entity2) => {
        if (entity1 === entity2) return gravity;
        const cord = Matrix.subtract(entity2.position, entity1.position);
        const direction = Matrix.unitVector(cord);
        const magnitude = GRAVITY_CONSTANT * (entity1.mass * entity2.mass / Math.pow(cord.vectorLength, 2));
        return Matrix.add(gravity, direction.scale(magnitude));
      }, new Matrix(2, 1));
      entity1.forces['gravity'] = gravity;
    });
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