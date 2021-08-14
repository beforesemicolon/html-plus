function Ignore(node) {
  return () => {
    let content = `${node.innerHTML}${node.getAttribute('value') || ''}`
    
    if (node.hasAttribute('escape')) {
      content = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    
    return content;
  }
}

Ignore.customAttributes = {
  value: {execute: true}
}

module.exports.Ignore = Ignore;
