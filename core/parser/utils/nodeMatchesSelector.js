function nodeMatchesSelector(node, selector) {
  if (selector.value === '*') {
    return true;
  }
  
  if (selector.type === 'tag') {
    return node.tagName === selector.name;
  }
  
  if (selector.type === 'attribute') {
    switch (selector.name) {
      case 'id':
        return node.id === selector.value;
      default:
        if (selector.value === null) {
          return node.hasAttribute(selector.name);
        }
        
        const value = node.getAttribute(selector.name);
        
        if (value !== null) {
          switch (selector.operator) {
            case '*':
              return value.includes(selector.value);
            case '^':
              return value.startsWith(selector.value);
            case '$':
              return value.endsWith(selector.value);
            case '|':
              return new RegExp(`^${selector.value}(?:$|-)`).test(value);
            case '~':
              return new RegExp(`\\b${selector.value}\\b`).test(value);
            default:
              if (/class|style/.test(selector.name) && selector.value) {
                return new RegExp(`\\b${selector.value}\\b`).test(value);
              }
              
              return node.hasAttribute(selector.name) && value === selector.value;
          }
        }
    }
  }
  
  if (selector.type === 'pseudo-class') {
    switch (selector.name) {
      case 'root':
      case 'not':
      case 'disabled':
      case 'enabled':
      case 'checked':
      case 'blank':
      case 'read-only':
      case 'read-write':
      case 'optional':
      case 'empty':
      case 'nth-last-child':
      case 'nth-child':
      case 'first-child':
      case 'last-child':
      case 'only-child':
      case 'nth-of-type':
      case 'nth-last-of-type':
      case 'first-of-type':
      case 'last-of-type':
      case 'only-of-type':
      default:
        console.log('-- pseudo-class', selector.name, selector.value);
    }
  }
  
  return false;
}

module.exports.nodeMatchesSelector = nodeMatchesSelector;
