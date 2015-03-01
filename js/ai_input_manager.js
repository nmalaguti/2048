function AiInputManager() {
  this.constructor.emitter.on('move', this.emit.bind(this, 'move'));
  this.constructor.emitter.on('keepPlaying', this.emit.bind(this, 'keepPlaying'));
  this.constructor.emitter.on('restart', this.emit.bind(this, 'restart'));
  KeyboardInputManager.apply(this);
}

AiInputManager.emitter = new Emitter();

AiInputManager.prototype = Object.create(KeyboardInputManager.prototype);
AiInputManager.prototype.constructor = AiInputManager;
