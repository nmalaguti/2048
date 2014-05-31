function Node(moveSimulator, playerTurn, move, probability) {
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

Node.prototype.children = function() {
  var self = this;

  var nodes = []

  if (self.isChance()) {
    var cells = self.moveSimulator.availableCells();
    var numberOfPeers = cells.length * 2;

    nodes = cells.map(function(cell) {
      var moveSimulator = new MoveSimulator(self.moveSimulator);
      moveSimulator.insertTile(cell.x, cell.y, 2);

      return new Node(moveSimulator, true, null, 0.9 / numberOfPeers);
    });

    nodes.concat(cells.map(function(cell) {
      var moveSimulator = new MoveSimulator(self.moveSimulator);
      moveSimulator.insertTile(cell.x, cell.y, 4);

      return new Node(moveSimulator, true, null, 0.1 / numberOfPeers);
    }));
  } else if (self.isPlayer()) {
    [0, 1, 2, 3].forEach(function(direction) {
      var moveSimulator = new MoveSimulator(self.moveSimulator);
      if (moveSimulator.move(direction)) {
        nodes.push(new Node(moveSimulator, false, direction, null));
      }
    });
  }

  return nodes;
}
