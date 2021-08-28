const {isObject, isArray} = require("util");

/**
 * merges object b with object a
 * support Array and Object literal only
 * @param a
 * @param b
 * @returns Object
 */
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
