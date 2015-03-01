function heuristic(node) {
  'use strict';
  if (!node.moveSimulator.movesAvailable()) {
    return -1E+50;
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

  for (x = 0; x < size; x++) {
   for (y = 0; y < size; y++) {
     v = cells[x * 4 + y];
     if (v) {
       zz += ((x + 1) * (y + 1)) * v;
       zt += ((x + 1) * (4 - y)) * v;
       tz += ((4 - x) * (y + 1)) * v;
       tt += ((4 - x) * (4 - y)) * v;
     }
   }
  }

  return node.moveSimulator.score + Math.max(zz, zt, tz, tt);
}
