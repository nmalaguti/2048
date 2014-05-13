function AiActuator() {
  HTMLActuator.apply(this);

  this.worker = new Worker("js/worker.js");

  this.worker.onmessage = function (oEvent) {
    AiInputManager.emitter.emit('move', oEvent.data.move);
  };
}

AiActuator.prototype = Object.create(HTMLActuator.prototype);
AiActuator.prototype.constructor = AiActuator;

AiActuator.prototype.actuate = function(grid, metadata) {
  if (!metadata.terminated) {
    this.worker.postMessage({
      grid: grid.serialize(),
      score: metadata.score
    });
  } else {
    this.continueState = function() {
      this.worker.postMessage({
        grid: grid.serialize(),
        score: metadata.score
      });
    }.bind(this);
  }

  HTMLActuator.prototype.actuate.apply(this, arguments);
}

AiActuator.prototype.message = function (won) {
  HTMLActuator.prototype.message.apply(this, arguments);

  if (won) {
    setTimeout(function() {
      AiInputManager.emitter.emit('keepPlaying');
      this.continueState();
    }.bind(this), 5000);
  } else {
    setTimeout(function() {
      AiInputManager.emitter.emit('restart');
    }, 5000);
  }
}
