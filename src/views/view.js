export default class View {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  get width() { return this.canvas.width; }
  get height() { return this.canvas.height; }

  update(gameState) {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
