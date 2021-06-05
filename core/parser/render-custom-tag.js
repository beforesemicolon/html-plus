async function renderCustomTag(tag, rawNode, node, nodeOptions) {
  let instance = () => '';
  const {customTags, customAttributes, onTraverse, ...opt} = nodeOptions
  
  const options = {
    ...opt,
    get partialFileObjects() {
      return opt.partialFileObjects.map(file => {
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
  
  return typeof instance === 'function'
    ? (await instance()) ?? ''
    : typeof instance.render === 'function'
      ? (await instance.render()) ?? ''
      : '';
}

module.exports.renderCustomTag = renderCustomTag;
