const renderChildren = async (children) => {
  let childList = children;
  
  if (typeof children === 'function') {
    childList = children();
  }

  return await Promise.all(childList.map(async node => {
      if (typeof node === 'object') {
        if (node.render && typeof node.render === 'function') {
          return node.render();
        }
        
        if (node.hasOwnProperty('value')) {
          return node.value;
        }
        
        return node.toString();
      }
      
      return node
    }))
    .then(res => {
      return res.join('\n');
    });
}

module.exports.renderChildren = renderChildren;