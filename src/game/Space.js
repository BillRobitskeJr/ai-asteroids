import Vector from "./Vector";
import PhysicsObject, { Vector2D } from "./PhysicsObject";

const DEFAULT_WIDTH = 640
const DEFAULT_HEIGHT = 480
const DEFAULT_GRAVITY = 10

export const Space = ({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, gravity = DEFAULT_GRAVITY }) => {
  const space = {
    width,
    height,
    gravity
  }
  return Object.freeze({
    ...space,
    constrainVector: constrainVector(space),
    getShortestPath: getShortestPath(space),
    calculateGravityForce: calculateGravityForce(space),
    isCollision: isCollision(space),
    collide: collide(space)
  })
}

export const constrainVector = ({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }) => ({ size = 2, coordinates = [0, 0]}) => Vector(size)(coordinates[0] % width, coordinates[1] % height)

export const getShortestPath = ({ width, height }) => ({ position: from }) => ({ position: to }) => {
  if (from === to) return Vector2D()
  const shifts = [
    Vector2D(-width, -height),
    Vector2D(-width, 0),
    Vector2D(-width, height),
    Vector2D(0, -height),
    Vector2D(0, 0),
    Vector2D(0, height),
    Vector2D(width, -height),
    Vector2D(width, 0),
    Vector2D(width, height)
  ]
  return shifts.map(shift => to.add(shift).subtract(from)).sort(({ length: a }, { length: b }) => a - b)[0]
}

export const calculateGravityForce = ({ width, height, gravity }) => ({ position, mass }) => ({ position: attractorPosition, mass: attractorMass }) => {
  const shortestPath = getShortestPath({ width, height })({ position })({ position: attractorPosition })
  if (shortestPath.length === 0) return Vector2D()
  return shortestPath.unit().scale(gravity * mass * attractorMass / Math.pow(shortestPath.length, 2))
}

export const isCollision = ({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }) => ({ position: position1 = Vector2D(), radius: radius1 = 1 }) => ({ position: position2 = Vector2D(), radius: radius2 = 1 }) => (getShortestPath({ width, height })({ position: position1 })({ position: position2 }).length <= (radius1 + radius2))

export const collide = ({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }) => (physicsObject1 = PhysicsObject()) => (physicsObject2 = PhysicsObject()) => {
  const shortestPath = getShortestPath({ width, height })(physicsObject1)(physicsObject2)
  return [ physicsObject1, physicsObject2 ]
}

export default Space
