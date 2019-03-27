export const Vector = (size = 0) => (...coordinates) => {
  const vector = {
    size,
    coordinates: (coordinates.length >= size)
      ? coordinates.slice(0, size)
      : coordinates.concat(Array(size - coordinates.length).fill(0))
  }
  return Object.freeze({
    ...vector,
    length: length(vector),
    angle: angle(vector),
    unit: unit.bind(null, vector),
    scale: scale(vector),
    add: add(vector),
    subtract: subtract(vector),
    rotate: rotate(vector)
  })
}

export const length = ({ coordinates = [] }) => Math.sqrt(coordinates.reduce((a, x) => a + x * x, 0))

export const angle = ({ size = 2, coordinates = [0, 0] }) => (size !== 2) ? false : (Math.acos(coordinates[0] / length({ coordinates })) * (coordinates[1] >= 0 ? 1 : -1))

export const unit = vector => scale(vector)(1 / length(vector))

export const scale = ({ size = 0, coordinates = [] }) => (multiplier = 1) => Vector(size)(...coordinates.map(x => x * multiplier))

export const add = ({ size = 0, coordinates: coordinates1 = [] }) => ({ coordinates: coordinates2 = [] }) => Vector(size)(...coordinates1.map((x, i) => x + (coordinates2[i] || 0)))

export const subtract = vector1 => vector2 => add(vector1)(scale(vector2)(-1))

export const rotate = vector => (angle = 0) => vector

export default Vector
