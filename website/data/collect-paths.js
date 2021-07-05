const collectPaths = list => {
  const paths = new Set();
  
  for (let item of list) {
    if (item.hasOwnProperty('path')) {
      paths.add(item.path);
      
      if (item.list && item.list.length) {
        Array.from(collectPaths(item.list), (p) => paths.add(p))
      }
    }
  }
  
  return paths;
}

module.exports.collectPaths = collectPaths;