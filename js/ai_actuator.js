function AiActuator() {
  HTMLActuator.apply(this);

  this.workers = [new Worker("js/worker.js")];
  this.nodeCount = 0;

  navigator.getHardwareConcurrency(function(cores) {
    this.workers = _.map(_.range(cores - 1), function(core) {
      return new Worker("js/worker.js");
    });
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
  var depth = 3;
  var result = {};

  this.nodeCount = 0;
  var startTime = (new Date).getTime();

//  this.expectimax(node, 9, function(result) {
//    if (typeof result.move == 'undefined') {
//      AiInputManager.emitter.emit('restart');
//    } else {
//      AiInputManager.emitter.emit('move', result.move);
//    }
//  }.bind(this));

  async.doWhilst(function(next) {
    depth += 2;
    this.expectimax(node, depth, function(res) {
      result = res;
      next();
    }.bind(this));
  }.bind(this), function() {
    return ((new Date).getTime() - startTime) < 75;
  }.bind(this), function(err) {
    console.log(depth);

    if (typeof result.move == 'undefined') {
      AiInputManager.emitter.emit('restart');
    } else {
      AiInputManager.emitter.emit('move', result.move);
    }
  }.bind(this));
}

AiActuator.prototype.expectimax = function(node, depth, callback) {
  if (node.isTerminal()) {
    callback({ alpha: -1E+100 });
  } else {
    var children = node.children();
    var results = [];
    async.mapLimit(children, this.workers.length, function(child, next) {
      var worker = this.workers.pop();

      worker.onmessage = function (oEvent) {
        this.nodeCount += oEvent.data.nodeCount;
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
      var curr = { alpha: -Infinity };
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
