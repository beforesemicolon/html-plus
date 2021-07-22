function createCustomTag(tag, rawNode, node, nodeOptions) {
  let instance = () => '';
  
  // no need to pass these to the custom tags
  const {customTags, defaultTags, customAttributes, onBeforeRender, context, ...opt} = nodeOptions
  
  const options = {
    ...opt,
    get partialFiles() {
      return opt.partialFiles.map(file => {
        // partial files are created outside the context of the node, therefore
        // the file root node needs to be update with the current node
        file.options = {...nodeOptions, rootNode: node, file};
        
        return file;
      })
    }
  }
  
  if (tag.toString().startsWith('class')) {
    instance = new tag(node, options)
  } else {
    instance = tag(node, options);
  }
  
  if (rawNode.parentNode && Object.keys(node.context ?? {}).length) {
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
      render: instance ?? (() => null),
    }
  }
  
  return typeof instance.render === 'function'
    ? instance
    : {render: () => ''}
}

module.exports.createCustomTag = createCustomTag;
