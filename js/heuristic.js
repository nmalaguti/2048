function heuristic(node) {
  'use strict';
  if (!node.moveSimulator.movesAvailable()) {
    return -1E+100;
  }

  var alpha = node.moveSimulator.score;

   var x;
   var y;
   var size = node.moveSimulator.size;
   var map = {};
   var i;
   var cells = node.moveSimulator.cells

   for (x = 0; x < size; x++) {
     for (y = 0; y < size; y++) {
       i = x * 4 + y;
       if (cells[i]) {
         if (!map[cells[i]]) {
           map[cells[i]] = [];
         }

         map[cells[i]].push({x: x, y: y});
       }
     }
   }

   var keys = _.keys(map);
   var high = _.last(keys);

   var corners = 0;

   _.forEach(map[high], function(highs) {
     var distanceFromCorner = Math.min(
           distance({x: 0, y: 0}, highs),
           distance({x: 0, y: 3}, highs),
           distance({x: 3, y: 0}, highs),
           distance({x: 3, y: 3}, highs));

     corners += distanceFromCorner * high;
   });

   alpha -= corners;

   var distances = 0;

   _.forEach(keys, function(key) {
     _.forEach(map[key], function(value) {
       if (value != high) {
         _.forEach(map[high], function(highs) {
           distances += (distance(highs, value) - 1) * key;
         });
       }
     });
   });

   alpha -= distances;

  return alpha;
}

function distance(a, b) {
  'use strict';
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


function getBaseLog(x, y) {
  'use strict';
  return Math.log(y) / Math.log(x);
}
