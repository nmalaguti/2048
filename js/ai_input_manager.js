function Emitter() {
  this.events = {};
}

Emitter.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

Emitter.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

function AiInputManager() {
  this.constructor.emitter.on('move', this.emit.bind(this, 'move'));
  this.constructor.emitter.on('keepPlaying', this.emit.bind(this, 'keepPlaying'));
  this.constructor.emitter.on('restart', this.emit.bind(this, 'restart'));
  KeyboardInputManager.apply(this);
}

AiInputManager.emitter = new Emitter();

AiInputManager.prototype = Object.create(KeyboardInputManager.prototype);
AiInputManager.prototype.constructor = AiInputManager;
