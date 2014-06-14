function AiActuator() {
  HTMLActuator.apply(this);

  this.depthContainer = document.querySelector(".depth-container");

  this.workers = [new Worker("js/worker.js")];

  navigator.getHardwareConcurrency(function(cores) {
    if (cores > 4) {
      cores = 4;
    }

    this.workers = this.workers.concat(_.map(_.range(cores - 1), function(core) {
      return new Worker("js/worker.js");
    }));
  }.bind(this));
}

AiActuator.prototype = Object.create(HTMLActuator.prototype);
AiActuator.prototype.constructor = AiActuator;

AiActuator.prototype.getNextMove = function(grid, metadata) {
  var fakeMoveSimulator = {
    cells: _.map(_.flatten(grid.serialize().cells), function(cell) {
      return cell ? cell.value : null;
    }),
    score: metadata.score,
    size: grid.size
  };

  var moveSimulator = new MoveSimulator(fakeMoveSimulator);
  var node = new Node(moveSimulator, true);
  var depth = 4;
  var result = {};
  var max = Math.max.apply(Math.max, fakeMoveSimulator.cells);
  var timeout = Math.floor(0.02 * max);

  var startTime = (new Date).getTime();

  async.doWhilst(function(next) {
    depth += 2;
    this.expectimax(node, depth, function(res) {
      result = res;
      next();
    }.bind(this));
  }.bind(this), function() {
    return ((new Date).getTime() - startTime) < timeout;
  }.bind(this), function(err) {
    if (typeof result.move == 'undefined') {
      AiInputManager.emitter.emit('restart');
    } else {
      this.updateDepth(depth);
      AiInputManager.emitter.emit('move', result.move);
    }
  }.bind(this));
}

AiActuator.prototype.expectimax = function(node, depth, callback) {
  if (node.isTerminal()) {
    callback({ alpha: -1E+50 });
  } else {
    var children = node.children();
    var results = [];
    async.mapLimit(children, this.workers.length, function(child, next) {
      var worker = this.workers.pop();

      worker.onmessage = function (oEvent) {
        results.push({
          alpha: oEvent.data.alpha,
          move: child.move
        });
        this.workers.push(worker);
        next();
      }.bind(this);

      worker.postMessage({
        cells: child.moveSimulator.cells.concat(),
        score: child.moveSimulator.score,
        size: child.moveSimulator.size,
        depth: depth - 1
      });
    }.bind(this), function(err) {
      var curr = { alpha: -1E+50 };
      results.forEach(function(em) {
        if (em.alpha > curr.alpha) {
          curr = em;
        }
      });
      callback(curr);
    });
  }
}

AiActuator.prototype.actuate = function(grid, metadata) {
  if (!metadata.terminated) {
    this.getNextMove(grid, metadata);
  } else {
    this.continueState = function() {
      this.getNextMove(grid, metadata);
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

AiActuator.prototype.updateDepth = function (depth) {
  this.clearContainer(this.depthContainer);

  this.depthContainer.textContent = Math.floor(depth/2);
};
