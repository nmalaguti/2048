importScripts("lodash.min.js",
              "bind_polyfill.js",
              "grid.js",
              "tile.js",
              "game_manager.js",
              "move_simulator.js",
              "expectimax.js");

onmessage = function (oEvent) {
  var fakeGameManager = {
    grid: {
      serialize: function() { return oEvent.data.grid; },
    },
    score: oEvent.data.score
  };

  var moveSimulator = new MoveSimulator(fakeGameManager);
  var node = new Node(moveSimulator, true);
  var result;

  var numberOfEmptyCells = moveSimulator.grid.availableCells().length;

  if (numberOfEmptyCells > 9) {
    result = expectimax(node, 5);
  } else if (numberOfEmptyCells > 5) {
    result = expectimax(node, 5);
  } else if (numberOfEmptyCells > 3) {
    result = expectimax(node, 5);
  } else {
    result = expectimax(node, 5);
  }

  //console.log(heuristic(node));

  postMessage(result);
};

function heuristic(node) {
  if (!node.moveSimulator.movesAvailable()) {
    return -1E+100;
  }

  // favor empty cells
  var alpha = 0;

  // favor highest value on an edge
  //var high = highestValue(node.moveSimulator.grid);


  alpha += emptyCells(node.moveSimulator.grid)
  //alpha += highestOnEdge(node.moveSimulator.grid, high);
  //alpha += highestInCorner(node.moveSimulator.grid, high);
  //alpha += hasUncombinedValues(node.moveSimulator.grid);
  alpha += distanceBetweenValues(node.moveSimulator.grid);

  return alpha;
}

function emptyCells(grid) {
  return -1 * Math.pow(16 - grid.availableCells().length, 4);
}

function highestValue(grid) {
  var value = 0;
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      value = Math.max(value, tile.value);
    }
  });

  return value;
}

function highestOnEdge(grid, high) {
  var alpha = 0;
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      if ((tile.value == high) && (x == 0 || x == 3 || y == 0 || y == 3)) {
        alpha += 1;
      }
    }
  });

  return alpha;
}

function highestInCorner(grid, high) {
  var alpha = 0;
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      if ((tile.value == high) && ((x == 0 && y == 0) ||
                                  (x == 0 && y == 3) ||
                                  (x == 3 && y == 0) ||
                                  (x == 3 && y == 3))) {
        alpha += getBaseLog(high, 2) * 8;
      }
    }
  });

  return alpha;
}

function hasUncombinedValues(grid) {
  var map = {};
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      map[tile.value + ''] = map[tile.value + ''] ? map[tile.value + ''] + 1 : 1;
    }
  });

  var alpha = 0;

  _.forOwn(map, function(value, key) {
    alpha -= ((value - 1) * 2 * getBaseLog(key, 2));
  });

  return alpha;
}

function distanceBetweenValues(grid) {
  var map = {};
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      if (!map[tile.value + '']) {
        map[tile.value + ''] = [];
      }

      map[tile.value + ''].push(tile);
    }
  });

  var alpha = 0;
  var temp;

  var high = _.last(_.keys(map));

  if (map[high].length == 1) {
    alpha -= Math.pow(Math.min(
          distance({x: 0, y: 0}, map[high][0]),
          distance({x: 0, y: 3}, map[high][0]),
          distance({x: 3, y: 0}, map[high][0]),
          distance({x: 3, y: 3}, map[high][0])), 2) * high * 1024;
  }

  _.forOwnRight(map, function(value, key) {
    if (value.length > 1) {
      alpha -= key * 64;
    } else if (temp) {
      alpha -= Math.pow((distance(temp, value[0]) - 1), 2) * key * 64;
    }

    temp = value[0];
  });

  return alpha;
}

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}
