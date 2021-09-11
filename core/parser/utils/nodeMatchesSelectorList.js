const {nodeMatchesSelector} = require("./nodeMatchesSelector");
const {traverseNodeAncestors} = require("./traverseNodeAncestors");

function nodeMatchesSelectorList(node, selectorIndex, selectorsList, initialNode = null) {
  initialNode = initialNode || node;
  let selectorGroup = selectorsList[selectorIndex];
  
  if (selectorGroup.length === 1 && selectorGroup[0].type === 'combinator') {
    const combinator = selectorGroup[0];
    
    switch (combinator.value) {
      case '~':
        let prevSib = node.prevElementSibling;
        
        while (prevSib) {
          if (nodeMatchesSelectorList(prevSib, selectorIndex - 1, selectorsList, initialNode)) {
            return true
          }
          
          prevSib = prevSib.prevElementSibling;
        }
        
        return false;
      case '+':
        if (node.prevElementSibling) {
          return nodeMatchesSelectorList(node.prevElementSibling, selectorIndex - 1, selectorsList, initialNode)
        }
        
        return false;
      case '>':
        if (node.parentNode) {
          return nodeMatchesSelectorList(node.parentNode, selectorIndex - 1, selectorsList, initialNode);
        }
        
        return false;
      default:
        selectorGroup = selectorsList[selectorIndex - 1];
        const matchedAncestors = [];
        traverseNodeAncestors(node, parent => {
          if (parent === initialNode) {
            return true;
          }
          
          if (selectorGroup.every(selector => nodeMatchesSelector(parent, selector))) {
            matchedAncestors.push(parent);
          }
        });
        
        if (!matchedAncestors.length) return false;
        
        if (selectorIndex - 1 === 0) return true;
        
        return matchedAncestors.some(parent => nodeMatchesSelectorList(parent, selectorIndex - 2, selectorsList, initialNode))
    }
  }
  
  return selectorGroup.every(selector => nodeMatchesSelector(node, selector))
}

module.exports.nodeMatchesSelectorList = nodeMatchesSelectorList;
