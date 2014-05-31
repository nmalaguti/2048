importScripts("lodash.min.js",
              "async.js",
              "move_simulator.js",
              "heuristic.js",
              "expectimax.js");

onmessage = function (oEvent) {
  var moveSimulator = new MoveSimulator(oEvent.data);
  var node = new Node(moveSimulator, false);
  var depth = oEvent.data.depth;

  var result = expectimax(node, depth);

  postMessage(result);
};
