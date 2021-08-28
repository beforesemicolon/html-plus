const {attrsPriorities} = require('./../default-attributes');

/**
 * collect custom attribute based on priority
 * @param attrs
 * @returns {null}
 */
function getNextCustomAttribute(attrs) {
  let lastPrio = 100;
  let nextAttr = null;
  
  for (let attr of attrs) {
    if (attr.startsWith('#')) {
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
