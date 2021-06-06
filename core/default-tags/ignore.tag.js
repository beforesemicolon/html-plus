function Ignore(node) {
  return () => node.innerHTML;
}

module.exports.Ignore = Ignore;