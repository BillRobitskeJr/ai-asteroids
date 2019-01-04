import Player from './player';

export default class HumanPlayer extends Player {
  constructor(state) {
    super(state);
    this.keyBindings = {
      'ArrowLeft': 'turnLeft',
      'ArrowRight': 'turnRight',
      'ArrowUp': 'thrust',
      ' ': 'shoot',
      'Enter': 'hyperspaceJump'
    };
    
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(event) {
    const command = this.keyBindings[event.key];
    if (command) this.keyFlags[command] = true;
  }

  onKeyUp(event) {
    const command = this.keyBindings[event.key];
    if (command) this.keyFlags[command] = false;
  };
}