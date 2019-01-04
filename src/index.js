import PlayerView from './views/player-view';
import ObserverView from './views/observer-view';
import ShipState from './states/ship-state';
import GameState from './states/game-state';
import HumanPlayer from './players/human-player';

window.addEventListener('load', () => {
  const gameState = new GameState({
    size: { width: 480, height: 480 },
    refreshRate: 60
  });
  const playerState = gameState.addShip(new ShipState({
    position: { x: 0.5, y: 0.5 },
    velocity: { heading: 0, speed: 0 },
    heading: 0
  }));

  const player = new HumanPlayer({
    shipState: playerState
  });

  const playerView = new PlayerView(document.querySelector('#player-view canvas').getContext('2d'), 480, 480, playerState);
  const observerView = new ObserverView(document.querySelector('#observer-view canvas').getContext('2d'), 480, 480);

  setInterval(() => {
    player.takeAction(1 / gameState.refreshRate);

    gameState.tickShips();

    playerView.update(gameState);
    observerView.update(gameState);
  }, 1000 / gameState.refreshRate);
});
