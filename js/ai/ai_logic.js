function AiLogic(depthUpdate) {
  this.depthUpdate = depthUpdate;
  this.workers = [new Worker("js/ai/worker.js")];
  this.depth = 4;

  navigator.getHardwareConcurrency(function(cores) {
    if (cores > 4) {
      cores = 4;
    }

    this.workers = this.workers.concat(_.range(cores - 1).map(function(core) {
      return new Worker("js/ai/worker.js");
    }));
    console.log("workers: " + cores);
  }.bind(this));
}

AiLogic.prototype.boardState = function(state) {
  var numWorkers = this.workers.length;
  var startTime = (new Date).getTime();

  async.mapLimit([0, 1, 2, 3], numWorkers, function(direction, next) {
    var worker = this.workers.pop();

    worker.onmessage = function (oEvent) {
      this.workers.push(worker);

      if (oEvent.data.moved) {
        next(null, {
          alpha: oEvent.data.alpha,
          move: direction,
          depth: oEvent.data.depth
        });
      } else {
        next();
      }
    }.bind(this);

    worker.postMessage({
      grid: state.grid,
      score: state.score,
      direction: direction,
      depth: this.depth
    });
  }.bind(this), function(err, results) {
    if (err) {
      console.log(err);
      return;
    }

    if (((new Date).getTime() - startTime) < 50) {
      this.depth += 2;
    } else if (((new Date).getTime() - startTime) > 500) {
      this.depth -= 2;
    }

    var nextMove = results.reduce(function(previousValue, currentValue) {
      if (currentValue && typeof currentValue.alpha != 'undefined' && typeof currentValue.move != 'undefined') {
        if (currentValue.alpha > previousValue.alpha) {
          return currentValue;
        }
      }

      return previousValue;
    }, { alpha: -Infinity});

    if (typeof nextMove.move == 'undefined') {
      this.depth = 4;
      AiInputManager.emitter.emit('restart');
    } else {
      this.depthUpdate(nextMove.depth);
      AiInputManager.emitter.emit('move', nextMove.move);
    }
  }.bind(this));
}
