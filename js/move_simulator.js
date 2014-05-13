function MoveSimulator(gameManager) {
  grid = gameManager.grid.serialize();
  this.grid = new Grid(grid.size, grid.cells);
  this.score = gameManager.score;
  this.won = false;
  this.moved = false;
  this.size = grid.size;
}

MoveSimulator.prototype = Object.create(GameManager.prototype);
MoveSimulator.prototype.constructor = MoveSimulator;

MoveSimulator.prototype.isGameTerminated = function() {
  return false;
}

MoveSimulator.prototype.actuate = function() {
  this.moved = true;
}

MoveSimulator.prototype.addRandomTile = function() {
  // nothing
}
