const {isObject, isArray} = require("util");

function mergeObjects(a, b) {
  if(!isObject(a) || !isObject(b)) return b ?? {};
  
  const obj = isArray(a) ? [...a] : {...a};
  
  for(const key in b) {
    if(b.hasOwnProperty(key)) {
      obj[key] = mergeObjects(obj[key], b[key]);
    }
  }
  
  return obj;
}

module.exports.mergeObjects = mergeObjects;
