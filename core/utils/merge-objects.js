const {isObject, isArray} = require("util");

const isObjectLiteral = x => isObject(x) && x.toString() === '[object Object]';

function mergeObjects(a, b) {
  if(!isObjectLiteral(a) || !isObjectLiteral(b)) return b ?? {};
  
  const obj = isArray(a) ? [...a] : a;
  
  for(const key in b) {
    if(b.hasOwnProperty(key)) {
      obj[key] = mergeObjects(obj[key], b[key]);
    }
  }
  
  return obj;
}

module.exports.mergeObjects = mergeObjects;
