const {attrsPriorities} = require('./../default-attributes/priority');

/**
 * collect custom attribute based on priority
 * @param node
 * @returns {null}
 */
function getNextCustomAttribute(node) {
  const attrs = Object.keys(attrsPriorities);
  let lastPrio = 100;
  let nextAttr = null;
  
  for (let attr of attrs) {
    if (node.hasOwnProperty(attr)) {
      const prio = attrsPriorities[attr] || 100;
  
      if (prio === 1) {
        nextAttr = attr;
        break;
      } else if(prio < lastPrio) {
        nextAttr = attr;
        lastPrio = prio;
      } else if(!nextAttr) {
        nextAttr = attr;
      }
    }
  }
  
  return nextAttr;
}

module.exports.getNextCustomAttribute = getNextCustomAttribute;
