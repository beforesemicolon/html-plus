
// the order the attributes should be picked on the tag
// will determine how to successfully render the node when multiple of these
// are present on the node
const attrsPriorities = {
  '#if': 1,
  '#repeat': 2,
  '#fragment': 3,
  '#attr': 4,
  '#ignore': 5
}

module.exports.attrsPriorities = attrsPriorities;