importScripts("lodash.min.js",
              "bind_polyfill.js",
              "move_simulator.js",
              "heuristic.js",
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
  var depth = 1;

  var startTime = (new Date).getTime();

  do {
    depth += 2;
    result = expectimax(node, depth);
    result.depth = depth;
  } while (((new Date).getTime() - startTime) * 20 < 1000);

  postMessage(result);
};
