var emscripten_expectimax_wrapped = Module.cwrap('example',
                        'number',
                        ['number', 'number', 'number', 'number',
                         'number', 'number', 'number', 'number',
                         'number', 'number', 'number', 'number',
                         'number', 'number', 'number']);

var emscripten_expectimax_alpha = function(node, depth) {
  var cells = node.moveSimulator.cells;
  var score = node.moveSimulator.score;
  var playerTurn = 0;
  if (node.playerTurn) {
    playerTurn = 1;
  }

  cells = cells.concat([score, depth, playerTurn]);

  return emscripten_expectimax_wrapped.apply(null, cells);
}
