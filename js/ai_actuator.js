function AiActuator() {
  HTMLActuator.apply(this);

  this.depthContainer = document.querySelector(".depth-container");

  this.aiLogic = new AiLogic(function(depth) {
    this.updateDepth(depth);
  }.bind(this));
}

AiActuator.prototype = Object.create(HTMLActuator.prototype);
AiActuator.prototype.constructor = AiActuator;

AiActuator.prototype.actuate = function(grid, metadata) {
  this.continueState = function() {
    this.aiLogic.boardState({
      grid: grid.serialize(),
      score: metadata.score
    });
  }.bind(this);

  if (!metadata.terminated) {
    this.continueState();
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

AiActuator.prototype.updateDepth = function (depth) {
  this.clearContainer(this.depthContainer);

  this.depthContainer.textContent = Math.floor(depth/2);
};
