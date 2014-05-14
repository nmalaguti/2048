importScripts("lodash.min.js",
              "bind_polyfill.js",
              "grid.js",
              "tile.js",
              "game_manager.js",
              "move_simulator.js",
              "expectimax.js");

onmessage = function (oEvent) {
  var fakeMoveSimulator = {
    cells: _.map(_.flatten(oEvent.data.grid.cells), function(cell) {
      return cell ? cell.value : null;
    }),
    score: oEvent.data.score,
    size: oEvent.data.grid.size
  };

  var moveSimulator = new MoveSimulator(fakeMoveSimulator);
  var node = new Node(moveSimulator, true);
  var result;

  // do {
  //   depth += 2;
  //   result = expectimax(node, depth);
  // } while (((new Date).getTime() - startTime) < 50)

  setTimeout(function() {
    result = expectimax(node, 9);

    console.log(JSON.stringify(result));

    postMessage(result);
  }, 500);
};

function heuristic(node, log) {
  if (!node.moveSimulator.movesAvailable()) {
    return -1E+100;
  }

  var alpha = node.moveSimulator.score;

  // var map = {};
  // node.moveSimulator.eachOccupiedCell(function(x, y, value) {
  //   if (!map[value + '']) {
  //     map[value + ''] = [];
  //   }

  //   map[value + ''].push({x: x, y: y});
  // });

  // var keys = _.keys(map);
  // var high = _.last(keys);

  // var corners = 0;

  // _.forEach(map[high], function(highs) {
  //   var distanceFromCorner = Math.min(
  //         distance({x: 0, y: 0}, highs),
  //         distance({x: 0, y: 3}, highs),
  //         distance({x: 3, y: 0}, highs),
  //         distance({x: 3, y: 3}, highs));

  //   corners += distanceFromCorner * high;
  // });

  // alpha -= corners;

  // var distances = 0;

  // _.forEachRight(_.first(keys, keys.length - 1), function(key) {
  //   _.forEach(map[key], function(value) {
  //     _.forEach(map[high], function(highs) {
  //       distances += (distance(highs, value) - 1) * key;
  //     });
  //   });
  // });

  // alpha -= distances;

  return alpha;
}

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}
