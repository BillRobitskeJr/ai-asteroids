export default class GameState {
  constructor(state) {
    const { size, refreshRate } = state;
    this.size = size;
    this.refreshRate = refreshRate;
    this.ships = [];
  }

  addShip(shipState) {
    this.ships.push(shipState);
    return shipState;
  }

  tickShips() {
    this.ships.forEach(ship => {
      ship.tickPosition(1 / this.refreshRate);
    });
  }
}