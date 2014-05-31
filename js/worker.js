importScripts("lodash.min.js",
              "async.js",
              "move_simulator.js",
              "heuristic.js",
              "expectimax.js");

onmessage = function (oEvent) {
  var moveSimulator = new MoveSimulator(oEvent.data);
  var node = new Node(moveSimulator, false);
  var depth = oEvent.data.depth;

  self.nodeCount = 0;
  var result = expectimax(node, depth);
  result.nodeCount = self.nodeCount;

  postMessage(result);
};
