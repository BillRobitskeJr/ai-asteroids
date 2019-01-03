import PlayerView from './views/player-view';
import ObserverView from './views/observer-view';
import ShipState from './states/ship-state';
import GameState from './states/game-state';

window.addEventListener('load', () => {
  const gameState = new GameState({
    size: { width: 480, height: 480 },
    refreshRate: 60
  });
  const playerState = gameState.addShip(new ShipState({
    position: { x: Math.random(), y: Math.random() },
    velocity: { heading: Math.random(), speed: Math.random() },
    heading: Math.random()
  }));

  const playerView = new PlayerView(document.querySelector('#player-view canvas').getContext('2d'), 480, 480, playerState);
  const observerView = new ObserverView(document.querySelector('#observer-view canvas').getContext('2d'), 480, 480);

  setInterval(() => {
    gameState.tickShips();

    playerView.update(gameState);
    observerView.update(gameState);
  }, 1000 / gameState.refreshRate);
});
