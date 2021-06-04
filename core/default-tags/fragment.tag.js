function Fragment(node) {
  return async () => await node.renderChildren();
}

module.exports.Fragment = Fragment;