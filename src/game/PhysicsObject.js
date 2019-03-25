import Vector from './Vector'

export const Vector2D = Vector(2)

export const PhysicsObject = ({ position = Vector2D(), velocity = Vector2D(), radius = 1, mass = 1 }) => {
  const physicsObject = {
    position,
    velocity,
    radius,
    mass
  }
  return Object.freeze({
    ...physicsObject,
    applyLinearForce: applyLinearForce(physicsObject)
  })
}

export const applyLinearForce = physicsObject => ({ force = Vector2D(), time = 0 }) => {
  const { position, velocity, mass } = physicsObject
  const acceleration = force.scale(1 / mass)
  return PhysicsObject({
    ...physicsObject,
    velocity: velocity.add(acceleration.scale(time)),
    position: position.add(velocity.scale(time)).add(acceleration.scale(Math.pow(time, 2) / 2))
  })
}

export default PhysicsObject
