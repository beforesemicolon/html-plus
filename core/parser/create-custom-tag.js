function createCustomTag(tag, rawNode, node, nodeOptions) {
  let instance = () => '';
  
  const options = {
    ...nodeOptions,
    get partialFileObjects() {
      return nodeOptions.partialFileObjects.map(file => {
        // partial files are created outside the context of the node, therefore
        // the file root node needs to be update with the current node
        file.options = {...nodeOptions, rootNode: node};
        
        return file;
      })
    }
  }
  
  if (tag.toString().startsWith('class')) {
    instance = new tag(node, options)
  } else {
    instance = tag(node, options);
  }
  
  if (Object.keys(node.context ?? {}).length) {
    const parentChildNodes = rawNode.parentNode.childNodes;
    // find the current child index in its parent child nodes list
    const childIndex = parentChildNodes.indexOf(rawNode);
    
    // loop all following child and update their context
    for (let i = childIndex + 1; i < parentChildNodes.length; i++) {
      parentChildNodes[i].context = {...(parentChildNodes[i].context || {}), ...node.context};
    }
  }
  
  if (typeof instance === 'function') {
    return {
      render: async () => (await instance()) ?? ''
    }
  }
  
  return typeof instance.render === 'function'
    ? instance
    : {render: () => ''}
}

module.exports.createCustomTag = createCustomTag;
