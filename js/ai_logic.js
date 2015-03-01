function AiLogic(depthUpdate) {
  this.worker = new Worker("js/ai/worker.js");

  this.worker.onmessage = function (oEvent) {
    if (typeof oEvent.data.move == 'undefined') {
      AiInputManager.emitter.emit('restart');
    } else {
      depthUpdate(oEvent.data.depth);
      AiInputManager.emitter.emit('move', oEvent.data.move);
    }
  }.bind(this);
}

AiLogic.prototype.boardState = function(state) {
  this.worker.postMessage(state);
}
