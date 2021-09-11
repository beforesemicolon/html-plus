function traverseNodeAncestors(node, cb) {
  let quit = false;
  let parent = node.parentNode;
  
  while (!quit && parent) {
    quit = cb(parent);
    
    if (quit) {
        break;
    }
    
    parent = parent.parentNode
  }
}

module.exports.traverseNodeAncestors = traverseNodeAncestors;
