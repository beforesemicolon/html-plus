const {tagCommentPattern, attrPattern} = require("./utils/regexPatterns");
const {Text} = require("./Text");
const {Comment} = require("./Comment");
const selfClosingTags = require("./utils/selfClosingTags.json");

/**
 * html regex based parser with support for Element context data and
 * attributes prefixed with # and complex logic as value
 * @param markup
 * @returns {Element}
 */
function parse(markup) {
  // since Element also uses parse importing it here will prevent
  // circular dependency issues
  const {Element} = require('./Element');
  const root = new Element();
  const stack = [root];
  let match;
  let lastIndex = 0;
  
  while ((match = tagCommentPattern.exec(markup)) !== null) {
    const [fullMatch, comment, closeOrBangSymbol, tagName, attributes, selfCloseSlash] = match;
    
    const parentNode = stack[stack.length - 1] || null;
    
    // grab in between text
    if (lastIndex !== match.index) {
      parentNode.appendChild(new Text(markup.slice(lastIndex, match.index)));
    }
    
    lastIndex = tagCommentPattern.lastIndex;
    
    if (comment) {
      parentNode.appendChild(new Comment(comment));
      continue;
    }
    
    if (closeOrBangSymbol === '!' || selfCloseSlash || selfClosingTags[tagName]) {
      const node = new Element(`${closeOrBangSymbol || ''}${tagName}`);
      
      let match = '';
      while ((match = attrPattern.exec(attributes))) {
        node.setAttribute(match[1], match[2] || match[3] || match[4] || null);
      }
      
      parentNode.appendChild(node);
    } else if (closeOrBangSymbol === '/' && parentNode.tagName === tagName) {
      stack.pop();
    } else if(!closeOrBangSymbol) {
      const node = new Element(tagName);
      
      let match = '';
      while ((match = attrPattern.exec(attributes))) {
        node.setAttribute(match[1], match[2] || match[3] || match[4] || null);
      }
      
      parentNode.appendChild(node);
      
      stack.push(node)
    }
  }
  
  // grab ending text
  if (lastIndex < markup.length) {
    root.appendChild(new Text(markup.slice(lastIndex)));
  }
  
  return root;
}

module.exports.parse = parse;