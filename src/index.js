import PlayerView from './views/player-view';
import ObserverView from './views/observer-view';
import ShipState from './states/ship-state';
import GameState from './states/game-state';
import HumanPlayer from './players/human-player';

const FRAMERATE = 30;

window.addEventListener('load', () => {
  const gameState = new GameState({
    size: [480, 480]
  });
  const shipState = gameState.addShip();

  const player = new HumanPlayer({
    shipState
  });

  const playerView = new PlayerView(document.querySelector('#player-view canvas').getContext('2d'), 480, 480, playerState);
  const observerView = new ObserverView(document.querySelector('#observer-view canvas').getContext('2d'), 480, 480);

  setInterval(() => {
    player.takeAction(1 / FRAMERATE);

    gameState.update(1 / FRAMERATE);

    playerView.update(gameState);
    observerView.update(gameState);
  }, 1000 / FRAMERATE);
});
