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
  if (this.isChance()) {
    return this.chanceChildren();
  } else if (this.isPlayer()) {
    return this.playerChildren();
  }

  return [];
}

Node.prototype.playerChildren = function() {
  var self = this;

  return [0, 1, 2, 3].reduce(function(previousValue, currentValue) {
    var moveSimulator = new MoveSimulator(self.moveSimulator);
    if (moveSimulator.move(currentValue)) {
      previousValue.push(new Node(moveSimulator, false, currentValue, null));
    }
    return previousValue;
  }, []);
}

Node.prototype.chanceChildren = function() {
  var nodes = [];
  var x;
  var y;

  for(x = 0; x < this.moveSimulator.size; x++) {
    for(y = 0; y < this.moveSimulator.size; y++) {
      if (!this.moveSimulator.cells[x * 4 + y]) {
        var moveSimulator = new MoveSimulator(this.moveSimulator);
        moveSimulator.insertTile(x, y, 2);
        nodes.push(new Node(moveSimulator, true, null, 0.9));

        moveSimulator = new MoveSimulator(this.moveSimulator);
        moveSimulator.insertTile(x, y, 4);
        nodes.push(new Node(moveSimulator, true, null, 0.1));
      }
    }
  }

  return nodes;
}
