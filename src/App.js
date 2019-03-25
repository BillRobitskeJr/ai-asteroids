import React, { Component } from 'react'
import './App.css'

import ViewCanvas from './components/presentation/ViewCanvas'

import PhysicsObject, { Vector2D } from './game/PhysicsObject'
import Space from './game/Space'

const wrapCoordinate = limit => (x, radius) => ((x - radius) < 0) ? x + limit : (((x + radius) > limit) ? x - limit : x)
const drawShape = context => (x, y, radius) => {
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI)
  context.stroke()
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      width: 640,
      height: 480,
      tickRate: 30,
      lastTickAt: null,
      refreshRate: 24,
      space: null,
      asteroids: []
    }
  }

  componentDidMount () {
    const { width, height, tickRate } = this.state
    const { setTimeout = window.setTimeout } = this.props
    const asteroids = Array(3).fill(0).map(() => PhysicsObject({
      position: Vector2D(Math.random() * width, Math.random() * height),
      velocity: Vector2D(Math.random() - 0.5, Math.random() - 0.5).unit().scale(Math.random() * 20),
      radius: Math.random() * 20,
      mass: Math.random() * 10
    }))

    this.setState({
      space: Space({ width, height }),
      asteroids,
      lastTickAt: Date.now()
    })
    setTimeout(this.onTick, 1 / tickRate)
  }

  render () {
    const { width, height, refreshRate } = this.state
    return (
      <div>
        <header>
          <h1>AI Asteroids</h1>
        </header>
        <ViewCanvas
          width={width}
          height={height}
          refreshRate={refreshRate}
          repaint={this.repaintCanvas} />
      </div>
    )
  }

  onTick = () => {
    const { setTimeout = window.setTimeout } = this.props
    const { tickRate, lastTickAt } = this.state
    const thisTickAt = Date.now()
    const interval = (thisTickAt - lastTickAt) / 1000

    this.updatePhysicsObjects(interval)

    this.setState({
      lastTickAt: thisTickAt
    })
    setTimeout(this.onTick, 1 / tickRate)
  }

  updatePhysicsObjects = (time = 0) => {
    const { space, asteroids } = this.state
    const updatedAsteroids = asteroids
      .map(asteroid => ({
        asteroid,
        gravity: asteroids.reduce((gravity, attractor) => {
          return gravity.add(space.calculateGravityForce(asteroid)(attractor))
        }, Vector2D())
      }))
      .map(({ asteroid, gravity }) => asteroid.applyLinearForce({ time, force: gravity }))
      .map(asteroid => PhysicsObject({ ...asteroid, position: space.constrainVector(asteroid.position) }))
    this.setState({ asteroids: updatedAsteroids })
  }

  repaintCanvas = ({ context, width, height }) => {
    const { asteroids } = this.state
    const drawCircle = drawShape(context)

    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    context.strokeStyle = 'white'
    asteroids.forEach(({ position, radius }) => {
      const [ x, y ] = position.coordinates
      const [ _x, _y ] = [ wrapCoordinate(width)(x, radius), wrapCoordinate(height)(y, radius) ]
      drawCircle(x, y, radius)
      if ((x !== _x) || (y !== _y)) drawCircle(_x, _y, radius)
    })
  }
}

export default App
