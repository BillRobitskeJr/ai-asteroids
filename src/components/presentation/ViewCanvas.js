import React, { Component } from 'react'

const DEFAULT_WIDTH = 640
const DEFAULT_HEIGHT = 480
const DEFAULT_REFRESH_RATE = 1

export class ViewCanvas extends Component {
  constructor (props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = { timer: null }
  }

  componentDidMount () {
    const { setInterval = window.setInterval, refreshRate = DEFAULT_REFRESH_RATE } = this.props
    this.setState({
      timer: setInterval(this.onInterval, 1 / refreshRate)
    })
  }

  componentWillUnbound () {
    const { clearInterval = window.clearInterval } = this.props
    clearInterval(this.state.timer)
    this.setState({ timer: null })
  }

  shouldComponentUpdate (nextProps) {
    const { width, height, refreshRate } = this.props
    const { width: newWidth, height: newHeight, refreshRate: newRefreshRate } = nextProps
    if (newRefreshRate !== refreshRate) {
      /**
       * If `refreshRate` is changed, behave as if component was "remounted"
       */
      this.componentWillUnbound()
      this.componentDidMount()
    }
    return (newWidth !== width) || (newHeight !== height)
  }

  render () {
    const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = this.props
    return (
      <canvas width={width} height={height} ref={this.canvasRef}></canvas>
    )
  }

  onInterval = () => {
    const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, repaint = () => {}} = this.props
    const context = this.canvasRef.current.getContext('2d')
    repaint({ context, width, height })
  }
}

export default ViewCanvas
