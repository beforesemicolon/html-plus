function Ignore(node) {
  return () => {
    let content = (node.attributes.hasOwnProperty('value')
      ? `${node.innerHTML}${node.attributes.value}`
      : node.innerHTML);
    
    if (node.attributes.hasOwnProperty('escape')) {
      content = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      node.removeAttribute('escape');
    }
    
    return content;
  }
}

Ignore.customAttributes = {
  value: {execute: true}
}

module.exports.Ignore = Ignore;