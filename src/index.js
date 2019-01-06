import PlayerView from './views/player-view';
import ObserverView from './views/observer-view';
import GameState from './states/game-state';
import HumanPlayer from './players/human-player';
import Matrix from './math/matrix';

const FRAMERATE = 60;

window.addEventListener('load', () => {
  const gameState = new GameState({
    size: [480, 480]
  });
  const shipState = gameState.addShip();

  console.log(shipState);
  const player = new HumanPlayer({ shipState });

  const playerView = new PlayerView(document.querySelector('#player-view canvas'), shipState);
  const observerView = new ObserverView(document.querySelector('#observer-view canvas'));

  setInterval(() => {
    player.takeAction(1 / FRAMERATE);

    gameState.update(1 / FRAMERATE);

    playerView.update(gameState);
    observerView.update(gameState);
  }, 1000 / FRAMERATE);
});
