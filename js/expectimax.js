function expectimax(node, depth) {
  if (depth === 0 || node.isTerminal()) {
    return { alpha: heuristic(node) };
  }

  var curr;

  if (node.isPlayer()) {
    curr = { alpha: -Infinity };
    node.eachChild(function(child) {
      var em = expectimax(child, depth - 1);
      if (em.alpha > curr.alpha) {
        curr.alpha = em.alpha;
        curr.move = child.move;
      }
    });
  } else if (node.isChance()) {
    curr = { alpha: 0 };
    node.eachChild(function(child) {
      curr.alpha += (child.probability * expectimax(child, depth - 1).alpha);
    });
  }

  return curr;
}

function Node(moveSimulator, playerTurn, move, probability) {
  // game state
  this.moveSimulator = moveSimulator;
  this.playerTurn = playerTurn;
  this.move = move;
  this.probability = probability;
}

Node.prototype.isTerminal = function() {
  return !this.moveSimulator.movesAvailable();
}

Node.prototype.isPlayer = function() {
  return this.playerTurn;
}

Node.prototype.isChance = function() {
  return !this.playerTurn;
}

Node.prototype.eachChild = function(callback) {
  var self = this;

  if (self.isChance()) {
    var numberOfPeers = self.moveSimulator.availableCells() * 2;
    self.moveSimulator.eachAvailableCell(function(x, y) {
      var moveSimulator2 = new MoveSimulator(self.moveSimulator);
      var moveSimulator4 = new MoveSimulator(self.moveSimulator);

      moveSimulator2.insertTile(x, y, 2);
      moveSimulator4.insertTile(x, y, 4);

      callback(new Node(moveSimulator2, true, null, 0.9 / numberOfPeers));
      callback(new Node(moveSimulator4, true, null, 0.1 / numberOfPeers));
    });
  } else if (self.isPlayer()) {
    [0, 1, 2, 3].forEach(function(direction) {
      var moveSimulator = new MoveSimulator(self.moveSimulator);
      moveSimulator.move(direction);
      if (moveSimulator.moved) {
        callback(new Node(moveSimulator, false, direction, null));
      }
    });
  }
}
