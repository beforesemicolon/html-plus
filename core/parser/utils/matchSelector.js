const {Selector} = require("../Selector");
const {traverseNodeAncestors} = require("./traverseNodeAncestors");

function matchNodeByNthNotation(node, notation, {selectorType = [], fromTheEnd = false} = {}) {
  if (node.parentNode) {
    let children = fromTheEnd
      ? [...node.parentNode.children].reverse()
      : node.parentNode.children;
    let match, startIndex, inc, endIndex;
    
    if (selectorType.length) {
      children = children
        .filter(child => {
          return selectorType
            .every((sel, index) => {
              return nodeMatchesSelector(child, sel, selectorType.slice(0, index));
            });
        })
    }
    
    switch (true) {
      case /^odd$/.test(notation):
        return children.some((n, i) => (i + 1) % 2 !== 0 && n === node);
      case /^even$/.test(notation):
        return children.some((n, i) => (i + 1) % 2 === 0 && n === node);
      case /^n$/.test(notation) || /n\+1/.test(notation):
        return children.includes(node);
      case /^\d+$/.test(notation):
        return children[Number(notation) - 1] === node;
      case /^\d+n$/.test(notation):
        inc = parseInt(notation);
        return children.some((n, i) => (i + 1) % inc === 0 && n === node);
      case /^n\+\d+$/.test(notation):
        match = notation.match(/n\+(\d+)/);
        startIndex = Number(match[1]);
        
        return children.slice(startIndex - 1).includes(node);
      case /^\d+n\+\d+$/.test(notation):
        match = notation.match(/(\d+)n\+(\d+)/);
        inc = Number(match[1]);
        startIndex = Number(match[2]);
        
        return children.slice(startIndex)
          .some((n, i) => (i + startIndex + 1) % inc === 0 && n === node);
      case /^-\d*n\+\d+$/.test(notation):
        match = notation.match(/-(\d*)n\+(\d+)/);
        inc = match[1] ? Number(match[1]) : 1;
        endIndex = Number(match[2]);
        
        return children.slice(0, endIndex)
          .some((n, i) => (i + 1) % inc === 0 && n === node);
      default:
        return false;
    }
  }
  
  return false;
}

function nodeMatchesSelector(node, selector, selectorType = []) {
  if (!(selector instanceof Selector)) {
    throw new Error('Invalid selector to match')
  }
  
  if (selector.value === '*') {
    return node?.nodeType === 1;
  }
  
  if (selector.type === 'tag') {
    return node.tagName === selector.name;
  }
  
  if (selector.type === 'attribute') {
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
          return new RegExp(`(?:^|\\s)${selector.value}(?:$|\\s)`, 'g').test(value);
        default:
          return selector.value === value;
      }
    }
    
    return false;
  }
  
  if (selector.type === 'pseudo-class') {
    selectorType = selectorType.length ? selectorType : [Selector.global()];
    
    switch (selector.name) {
      case 'root':
        return node.tagName === null && node.parentNode === null;
      case 'not':
        if (selector.value instanceof Selector) {
          return !nodeMatchesSelector(node, selector.value, selectorType);
        }
        
        if (Array.isArray(selector.value)) {
          if (selector.value.flat().some(sel => sel.name === 'not')) {
            throw new Error(':not selectors cannot be nested')
          }
          
          return !nodeMatchesSelectorList(node, selector.value.length - 1, selector.value, node)
        }
        
        throw new Error('Invalid selector to match')
      case 'disabled':
        return node.hasAttribute('disabled');
      case 'enabled':
        return !node.hasAttribute('disabled');
      case 'checked':
        return node.hasAttribute('checked');
      case 'read-only':
        // all elements are read-only by default except input and textarea which require the "readonly" attribute
        // if a element has the "contenteditable" attribute it become writable
        return /input|textarea/.test(node.tagName) ? node.hasAttribute('readonly') : !node.isContentEditable;
      case 'read-write':
        return /input|textarea/.test(node.tagName) ? !node.hasAttribute('readonly') : node.isContentEditable;
      case 'optional':
        return /input|textarea|select/.test(node.tagName) && !node.hasAttribute('required');
      case 'empty':
        return node.childNodes.length === 0;
      case 'nth-last-child':
        return matchNodeByNthNotation(node, selector.value, {fromTheEnd: true});
      case 'nth-child':
        return matchNodeByNthNotation(node, selector.value);
      case 'first-child':
        return Boolean(node.parentNode && node.parentNode.firstChild === node);
      case 'last-child':
        return Boolean(node.parentNode && node.parentNode.lastChild === node);
      case 'only-child':
        return Boolean(node.parentNode && node.parentNode.children.length === 1 && node.parentNode.children[0] === node);
      case 'nth-of-type':
        return matchNodeByNthNotation(node, selector.value, {selectorType});
      case 'nth-last-of-type':
        return matchNodeByNthNotation(node, selector.value, {fromTheEnd: true, selectorType});
      case 'first-of-type':
        const firstOfTypeNode = node.parentNode.children
          .find(child => {
            return selectorType
              .every((sel, index) => {
                return nodeMatchesSelector(child, sel, selectorType.slice(0, index));
              });
          });
        
        return firstOfTypeNode === node;
      case 'last-of-type':
        let lastOfTypeNode;
        
        for (let i = node.parentNode.children.length - 1; i < node.parentNode.children.length; i--) {
          lastOfTypeNode = node.parentNode.children[i];
          
          if (selectorType
            .every((sel, index) => {
              return nodeMatchesSelector(lastOfTypeNode, sel, selectorType.slice(0, index));
            })) {
            break;
          }
        }
        
        return lastOfTypeNode === node;
      case 'only-of-type':
        let onlyOfTypeNode;
        
        for (let child of node.parentNode.children) {
          const n = selectorType
            .every((sel, index) => {
              return nodeMatchesSelector(child, sel, selectorType.slice(0, index));
            });
          
          if (n) {
            if (onlyOfTypeNode) {
              return false
            }
            
            onlyOfTypeNode = child;
          }
        }
        
        return onlyOfTypeNode === node;
      default:
        return false;
    }
  }
  
  return false;
}

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
          
          if (selectorGroup.every((selector, index) => nodeMatchesSelector(parent, selector, selectorGroup.slice(0, index)))) {
            matchedAncestors.push(parent);
          }
        });
        
        if (!matchedAncestors.length) return false;
        
        if (selectorIndex - 1 === 0) return true;
        
        return matchedAncestors.some(parent => nodeMatchesSelectorList(parent, selectorIndex - 2, selectorsList, initialNode))
    }
  }
  
  const matched = selectorGroup
    .every((selector, index) => nodeMatchesSelector(node, selector, selectorGroup.slice(0, index)));
  
  // once you match a node we crawl up the selector list for further match
  // the previous selector must be always a combinator so we continue with the same node
  // as that will be handled accordingly
  if (matched && selectorsList[selectorIndex - 1]) {
    return nodeMatchesSelectorList(node, selectorIndex - 1, selectorsList, initialNode)
  }
  
  return matched;
}

module.exports = {
  single: nodeMatchesSelector,
  list: nodeMatchesSelectorList
}
