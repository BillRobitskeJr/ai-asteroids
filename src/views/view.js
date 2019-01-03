export default class View {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  update(gameState) {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
