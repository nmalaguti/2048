importScripts("lodash.min.js",
              "../bind_polyfill.js",
              "move_simulator.js",
              "node.js",
              "heuristic.js",
              "expectimax.js");

function doMove(fakeMoveSimulator, direction, depth) {
  var result = {
    moved: false
  };

  var moveSimulator = new MoveSimulator(fakeMoveSimulator);
  if (moveSimulator.move(direction)) {
    var node = new Node(moveSimulator, false, direction, null);
    result = expectimax(node, depth - 1);
    result.depth = depth;
    result.moved = true;
  }

  postMessage(result);
}

onmessage = function (oEvent) {
  var moveSimulator = new MoveSimulator(oEvent.data);
  var node = new Node(moveSimulator, false);
  var depth = oEvent.data.depth;

  var direction = oEvent.data.direction;
  var depth = oEvent.data.depth;

  doMove(fakeMoveSimulator, direction, depth);
};

