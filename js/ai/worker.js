importScripts("lodash.min.js",
              "../bind_polyfill.js",
              "move_simulator.js",
              "node.js",
              "heuristic.js",
              "expectimax.js",
              "emscripten_core.js",
              "emscripten_wrapper.js");

function doMove(fakeMoveSimulator, direction, depth) {
  var result = {
    moved: false
  };

  var moveSimulator = new MoveSimulator(fakeMoveSimulator);
  if (moveSimulator.move(direction)) {
    var node = new Node(moveSimulator, false, direction, null);
    result.alpha = emscripten_expectimax_alpha(node, depth - 1);
    result.depth = depth;
    result.moved = true;
  }

  postMessage(result);
}

onmessage = function (oEvent) {
  var fakeMoveSimulator = {
    cells: _.map(_.flatten(oEvent.data.grid.cells), function(cell) {
      return cell ? cell.value : null;
    }),
    score: oEvent.data.score,
    size: oEvent.data.grid.size
  };

  var direction = oEvent.data.direction;
  var depth = oEvent.data.depth;

  doMove(fakeMoveSimulator, direction, depth);
};

