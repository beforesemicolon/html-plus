class QueryAdapter {
  isTag(node) {
    return node.nodeName === '#node';
  }
  
  getChildren(node) {
    return node.children;
  }
  
  existsOne(test, nodes) {
    return nodes.some(test);
  }
  
  filter(test, nodes, recurse, limit = null) {
    if (Array.isArray(nodes)) {
      let matches = [];
      
      for (let node of nodes) {
        if (test(node)) {
          matches.push(node);
        }
        
        if (limit && matches.length === limit) {
          break;
        }
        
        if (recurse) {
          const deepMatches = this.filter(test, node.children, recurse, limit ? limit - matches.length : null);
          matches = [...matches, ...deepMatches];
        }
      }
      
      return matches;
    }
    
    return test(nodes) ? [nodes] : [];
  }
  
  find(...args) {
    return this.filter(...args);
  }
  
  findAll(test, nodes) {
    return this.filter(test, nodes, true);
  }
  
  findOne(test, nodes, recurse) {
    for (let node of nodes) {
      if (test(node)) {
        return node;
      }
    
      if (recurse) {
        const matched = this.findOne(test, node.children, recurse);
        if (matched) {
          return matched
        }
      }
    }
  
    return null;
  }
  
  findOneChild(test, nodes) {
    for (let node of nodes) {
      if (test(node)) {
        return node;
      }
    }
  
    return null;
  }
  
  getAttributeValue(node, name) {
    return node.getAttribute(name);
  }
  
  getName(node) {
    return node.nodeName
  }
  
  getParent(node) {
    return node.parentNode
  }
  
  getSiblings(node) {
    return node.parentNode.children;
  }
  
  hasAttrib(node, name) {
    return node.hasAttribute(name);
  }
  
  nextElementSibling(node) {
    return node.nextElementSibling;
  }
  
  prevElementSibling(node) {
    return node.prevElementSibling;
  }
  
  getInnerHTML(node) {
    return node.innerHTML;
  }
  
  getOuterHTML(node) {
    return node.outerHTML;
  }
  
  getText(node) {
    return node.textContent;
  }
  
  innerText(node) {
    return node.textContent;
  }
  
  textContent(node) {
    return node.textContent;
  }
}

module.exports.QueryAdapter = QueryAdapter;
