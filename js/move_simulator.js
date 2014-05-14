function MoveSimulator(moveSimulator) {
  this.score = moveSimulator.score;
  this.moved = false;
  this.size = moveSimulator.size;
  this.cells = moveSimulator.cells.slice(0);
  this.max = this.size * this.size;
}

MoveSimulator.prototype.insertTile = function(x, y, value) {
  this.cells[x * 4 + y] = value;
}

MoveSimulator.prototype.eachAvailableCell = function(callback) {
  for(x = 0; x < this.size; x++) {
    for(y = 0; y < this.size; y++) {
      if (!this.cells[x * 4 + y]) {
        callback(x, y);
      }
    }
  }
}

MoveSimulator.prototype.cellsAvailable = function() {
  for (var i = 0; i < this.max; i++) {
    if (!this.cells[i]) {
      return true;
    }
  }
  return false;
}

MoveSimulator.prototype.availableCells = function() {
  var c = 0;
  for(x = 0; x < this.size; x++) {
    for(y = 0; y < this.size; y++) {
      if (!this.cells[x * 4 + y]) {
        c++;
      }
    }
  }
  return c;
}

MoveSimulator.prototype.eachOccupiedCell = function(callback) {
  for(x = 0; x < this.size; x++) {
    for(y = 0; y < this.size; y++) {
      if (this.cells[x * 4 + y]) {
        callback(x, y, this.cells[x * 4 + y]);
      }
    }
  }
}

MoveSimulator.prototype.movesAvailable = function() {
  return this.cellsAvailable() || this.tileMatchesAvailable();
}

MoveSimulator.prototype.tileMatchesAvailable = function () {
  var value;
  var vectorx;
  var vectory;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      value = this.cells[x * 4 + y];

      if (value) {
        for (var direction = 0; direction < 4; direction++) {
          if (direction === 0) {
            vectorx = 0;
            vectory = -1;
          } else if (direction === 1) {
            vectorx = 1;
            vectory = 0;
          } else if (direction === 2) {
            vectorx = 0;
            vectory = 1;
          } else if (direction === 3) {
            vectorx = -1;
            vectory = 0;
          }

          var other  = this.cells[((x + vectorx) * 4) + (y + vectory)];

          if (other && other === value) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

MoveSimulator.prototype.move = function(direction) {
  // 0: up, 1: right, 2: down, 3: left
  var startx;
  var starty;
  var iterx;
  var itery;
  var vectorx;
  var vectory;

  if (direction === 0) {
    startx = 0;
    starty = 0;
    iterx = 1;
    itery = 1;
    vectorx = 0;
    vectory = -1;
  } else if (direction === 1) {
    startx = 3;
    starty = 0;
    iterx = -1;
    itery = 1;
    vectorx = 1;
    vectory = 0;
  } else if (direction === 2) {
    startx = 0;
    starty = 3;
    iterx = 1;
    itery = -1;
    vectorx = 0;
    vectory = 1;
  } else if (direction === 3) {
    startx = 0;
    starty = 0;
    iterx = 1;
    itery = 1;
    vectorx = -1;
    vectory = 0;
  }

  var i;
  var x;
  var y;

  for(x = startx; x < this.size && x >= 0; x += iterx) {
    for(y = starty; y < this.size && y >= 0; y += itery) {
      i = x * 4 + y;

      if (this.cells[i]) {
        var value = this.cells[i];
        var previous;
        var locationx = x;
        var locationy = y;
        var location = i;

        do {
          previous = location;
          locationx += vectorx;
          locationy += vectory;
          location = locationx * 4 + locationy;
        } while (locationy >= 0 && locationy < this.size && locationx >= 0 && locationx < this.size && !this.cells[location]);

        if (locationy >= 0 && locationy < this.size && locationx >= 0 && locationx < this.size && this.cells[location] && this.cells[location] === value && value > 0) {
          this.cells[location] *= -2;
          this.cells[i] = null;
          this.score += Math.abs(this.cells[location]);
          this.moved = true;
        } else if (previous !== i) {
          this.cells[previous] = value;
          this.cells[i] = null;
          this.moved = true;
        }
      }
    }
  }

  this.cells = this.cells.map(function(cell) {
    return cell ? Math.abs(cell) : cell;
  });
}
