function expectimax(node, depth) {
  if (depth === 0 || node.isTerminal()) {
    if (depth !== 0) {
      return { alpha: -1E+50 };
    }
    return { alpha: heuristic(node) };
  }

  var curr;

  if (node.isPlayer()) {
    curr = { alpha: -1E+50 };
    node.children().forEach(function(child) {
      var em = expectimax(child, depth - 1);
      if (em.alpha > curr.alpha) {
        curr.alpha = em.alpha;
        curr.move = child.move;
      }
    });
  } else if (node.isChance()) {
    curr = { alpha: 0 };
    node.children().forEach(function(child) {
      curr.alpha += (child.probability * expectimax(child, depth - 1).alpha);
    });
  }

  return curr;
}
