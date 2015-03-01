function MoveSimulator(gameManager) {
  this.score = gameManager.score;
  this.size = gameManager.size;
  this.max = this.size * this.size;
  this.cells = gameManager.cells.concat();
}

MoveSimulator.prototype.insertTile = function(x, y, value) {
  this.cells[x * 4 + y] = value;
}

MoveSimulator.prototype.move = function(direction) {
  // 0: up, 1: right, 2: down, 3: left
  var x;
  var y;
  var size = this.size;
  var cells = this.cells;
  var value;
  var i;
  var previous;
  var locationy;
  var locationx;
  var location;
  var moved = false;

  if (direction === 0) {
    for(x = 0; x < size; x++) {
      for(y = 0; y < size; y++) {
        i = x * 4 + y;
        if (cells[i] !== null) {
          value = cells[i];
          locationy = y;
          location = i;

          do {
            previous = location;
            location = x * 4 + --locationy;
          } while (locationy >= 0 && cells[location] === null);

          if (locationy >= 0 && cells[location] === value && value > 0) {
            cells[location] *= -2;
            cells[i] = null;
            this.score += Math.abs(cells[location]);
            moved = true;
          } else if (previous !== i) {
            cells[previous] = value;
            cells[i] = null;
            moved = true;
          }
        }
      }
    }
  } else if (direction === 1) {
    for(x = 3; x >= 0; x--) {
      for(y = 0; y < size; y++) {
        i = x * 4 + y;
        if (cells[i] !== null) {
          value = cells[i];
          locationx = x;
          location = i;

          do {
            previous = location;
            location = ++locationx * 4 + y;
          } while (locationx < size && cells[location] === null);

          if (locationx < size && cells[location] === value && value > 0) {
            cells[location] *= -2;
            cells[i] = null;
            this.score += Math.abs(cells[location]);
            moved = true;
          } else if (previous !== i) {
            cells[previous] = value;
            cells[i] = null;
            moved = true;
          }
        }
      }
    }
  } else if (direction === 2) {
    for(x = 0; x < size; x++) {
      for(y = 3; y >= 0; y--) {
        i = x * 4 + y;
        if (cells[i] !== null) {
          value = cells[i];
          locationy = y;
          location = i;

          do {
            previous = location;
            location = x * 4 + ++locationy;
          } while (locationy < size && cells[location] === null);

          if (locationy < size && cells[location] === value && value > 0) {
            cells[location] *= -2;
            cells[i] = null;
            this.score += Math.abs(cells[location]);
            moved = true;
          } else if (previous !== i) {
            cells[previous] = value;
            cells[i] = null;
            moved = true;
          }
        }
      }
    }
  } else if (direction === 3) {
    for(x = 0; x < size; x++) {
      for(y = 0; y < size; y++) {
        i = x * 4 + y;
        if (cells[i] !== null) {
          value = cells[i];
          locationx = x;
          location = i;

          do {
            previous = location;
            location = --locationx * 4 + y;
          } while (locationx >= 0 && cells[location] === null);

          if (locationx >= 0 && cells[location] === value && value > 0) {
            cells[location] *= -2;
            cells[i] = null;
            this.score += Math.abs(cells[location]);
            moved = true;
          } else if (previous !== i) {
            cells[previous] = value;
            cells[i] = null;
            moved = true;
          }
        }
      }
    }
  }

  this.cells = cells.map(function(cell) {
    return cell ? Math.abs(cell) : cell;
  });

  return moved;
}

MoveSimulator.prototype.availableCells = function () {
  var cells = [];

  for(x = 0; x < this.size; x++) {
    for(y = 0; y < this.size; y++) {
      if (!this.cells[x * 4 + y]) {
        cells.push({x: x, y: y});
      }
    }
  }

  return cells;
};

MoveSimulator.prototype.occupiedCells = function () {
  var cells = [];

  for(x = 0; x < this.size; x++) {
    for(y = 0; y < this.size; y++) {
      if (this.cells[x * 4 + y]) {
        cells.push({x: x, y: y, value: this.cells[x * 4 + y]});
      }
    }
  }

  return cells;
};

MoveSimulator.prototype.movesAvailable = function() {
  var cells = this.cells;
  var i;

  for (i = 0; i < this.max; i++) {
    if (!cells[i]) {
      return true;
    }
  }

  var value;
  var vectorx;
  var vectory;
  var size = this.size;
  var direction;
  var x;
  var y;
  var other;

  for (x = 0; x < size; x++) {
    for (y = 0; y < size; y++) {
      value = cells[x * 4 + y];

      if (value) {
        for (direction = 0; direction < 4; direction++) {
          if (direction === 0) {
            other = this.cells[x * 4 + (y - 1)]
          } else if (direction === 1) {
            other = this.cells[(x + 1) * 4 + y];
          } else if (direction === 2) {
            other = this.cells[x * 4 + (y + 1)];
          } else if (direction === 3) {
            other = this.cells[(x - 1) * 4 + y];
          }

          if (other === value) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
