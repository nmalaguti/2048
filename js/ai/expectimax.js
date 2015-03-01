function expectimax(node, depth) {
  if (depth === 0 || node.isTerminal()) {
    if (depth !== 0) {
      return { alpha: -1E+50 };
    }
    return { alpha: heuristic(node) };
  }

  if (node.isPlayer()) {
    return node.children().reduce(function(previousValue, currentValue) {
      var em = expectimax(currentValue, depth - 1);
      if (em.alpha > previousValue.alpha) {
        return {
          alpha: em.alpha,
          move: currentValue.move
        }
      }
      return previousValue;
    }, { alpha: -Infinity });
  } else if (node.isChance()) {
    var children = node.children();
    var length = children.length;

    return {
      alpha: children.reduce(function(previousValue, currentValue) {
        return previousValue + (currentValue.probability / length * expectimax(currentValue, depth - 1).alpha);
      }, 0)
    };
  }
}
