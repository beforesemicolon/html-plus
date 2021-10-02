const {Selector} = require("../Selector");

/**
 * creates a selector list from the CSS selector String.
 * All selectors will be an instance of Selector class
 * @param selectorString
 * @returns Array<Selector>
 */
function createSelectors(selectorString) {
  selectorString = selectorString.trim();
  
  if (/^(\+|\~|\>)/.test(selectorString)) {
    throw new Error('Invalid selector string: It may not start with any combinator symbol.')
  }
  
  if (/(\+|\~|\>)$/.test(selectorString)) {
    throw new Error('Invalid selector string: It may not end with any combinator symbol.')
  }
  
  const selectors = /(\+|\~|\>|\*)|:([a-z][a-z-]*)(?:\(([^)]*)\))?|\[\s*([a-z][\w:.-]*)\s*(?:\s*(\*|\||\^|\$|\~)?\s*=\s*"([^"]*)")?\s*(i|s)?\s*\]|(?:#|\.)?([a-z][\w-]*)|(?<=[^>+~\s])([ \t]+)(?=[^>+~\s])/gi;
  const pseudoClass = /:(root|not|disabled|enabled|checked|read-only|read-write|required|optional|empty|nth-last-child|nth-child|first-child|last-child|only-child|nth-of-type|nth-last-of-type|first-of-type|last-of-type|only-of-type)/;
  let selectorsList = [];
  let match;
  let lastSelector = null;
  selectors.lastIndex = 0
  
  while ((match = selectors.exec(selectorString)) !== null) {
    let selector = null;
    
    switch (true) {
      case match[0].startsWith('#'):
        selector = Selector.id(match[8]);
        break;
      case match[0].startsWith('.'):
        selector = Selector.class(match[8]);
        selector.operator = '~';
        break;
      case match[0].startsWith(':') && pseudoClass.test(match[0]):
        const name = match[2];
        const value = match[3];
        
        if (name === 'not') {
          if (/:not/g.test(value) || /,/g.test(value)) {
            selector = null;
          } else {
            selector = Selector.pseudoClass(name, createSelectors(value).flat());
          }
        } else {
          selector = Selector.pseudoClass(name, value);
        }
        
        break;
      case match[0].startsWith('[') && match[0].endsWith(']'):
        if (/\s+/.test(match[6])) {
          throw new Error('Invalid selector string: Attribute value must not contain spaces.')
        }
        
        selector = Selector.attribute(match[2] || match[4], match[6]);
        
        if (match[5]) {
          selector.operator = match[5];
        }
        
        if (match[7]) {
          selector.modifier = match[7];
        }
        
        break;
      case match[0] === '*':
        selector = Selector.global();
        break;
      case /^\s+$/.test(match[0]):
        selector = Selector.combinator(' ');
        break;
      case match[1] === '+':
      case match[1] === '~':
      case match[1] === '>':
        selector = Selector.combinator(match[1]);
        break;
      default:
        if (match[8] && /[a-z][\w-]*/i.test(match[8])) {
          selector = Selector.tag(match[8]);
        }
    }
    
    if (selector) {
      if (lastSelector && lastSelector.type === 'combinator' && lastSelector.type === selector.type) {
        throw new Error('Invalid selector string: Must not contain nested combinator symbols.')
      }
      
      selectorsList.push(selector);
      lastSelector = selector;
    } else {
      // if any selector fails, the whole selector is invalid
      // so the selector list becomes empty and we quit the loop
      selectorsList = [];
      break;
    }
  }
  
  return selectorsList
    .reduce(({selectors, lastSelector}, sel) => {
      if (!selectors.length) {
        selectors = [[sel]];
      } else if (sel.type === 'combinator' || lastSelector.type === 'combinator') {
        selectors = [...selectors, [sel]];
      } else {
        selectors[selectors.length - 1].push(sel)
      }
      
      return {selectors, lastSelector: sel};
    }, {selectors: [], lastSelector: null}).selectors;
}

module.exports.createSelectors = createSelectors;
