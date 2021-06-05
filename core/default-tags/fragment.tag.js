function Fragment(node) {
  return () => node.renderChildren();
}

module.exports.Fragment = Fragment;