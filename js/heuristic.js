function heuristic(node) {
  'use strict';
  if (!node.moveSimulator.movesAvailable()) {
    return -1E+100;
  }

  var x;
  var y;
  var size = node.moveSimulator.size;
  var cells = node.moveSimulator.cells;

  var zz = 0;
  var zt = 0;
  var tz = 0;
  var tt = 0;
  var v;
  var m = 0;
  var empty = 0;
  var mask = 0;
  var alpha = 0;

  for (x = 0; x < size; x++) {
   for (y = 0; y < size; y++) {
     v = cells[x * 4 + y];
     alpha -= mask & v;
     mask |= v;
     empty += v === null ? 1 : 0;
     m = Math.max(m, v);
     zz -= Math.pow(2, ((x + 1) * (y + 1))) * v;
     zt -= Math.pow(2, ((x + 1) * (2 - y))) * v;
     tz -= Math.pow(2, ((2 - x) * (y + 1))) * v;
     tt -= Math.pow(2, ((2 - x) * (2 - y))) * v;
   }
  }

  return node.moveSimulator.score - Math.min(zz, zt, tz, tt) - Math.pow(node.moveSimulator.max - empty, 2) - alpha;
}

function distance(a, b) {
  'use strict';
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


function getBaseLog(x, y) {
  'use strict';
  return Math.log(y) / Math.log(x);
}
