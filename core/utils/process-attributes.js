const {executeCode} = require("../../../utils/execute-code");
const {bindData} = require("./bind-data");
const specialAttributes = require('./specialAttributes.json');

const camelcaseString = str => str
  .match(/\w+/g)
  .map((p, i) => i === 0 ? p : p[0].toUpperCase() + p.slice(1))
  .join('');

function processNodeAttributes(node, data) {
  const attributes = node.attributes;
  
  for (let attrName of Object.keys(node.attributes)) {
    let val = node.attributes[attrName].trim();

    try {
      if (specialAttributes[attrName]) {
        const attr = specialAttributes[attrName]
        if (attr.process && (attr.tags === "*" || attr.tags.includes[node.rawTagName])) {
          val = executeCode(`(() => (${val}))()`, data);
        }
      } else {
        val = bindData(val, data)
      }
    } catch (e) {}

    if (val === 'true') {
      val = true
    } else if (val === 'false') {
      val = false
    } else if (!isNaN(Number(val))) {
      val = Number(val);
    }

    node.setAttribute(attrName, val);
    attributes[camelcaseString(attrName)] = val;

    if (specialAttributes[attrName]) {
      node.removeAttribute(attrName);
    }
  }
  
  return attributes;
}

module.exports.processNodeAttributes = processNodeAttributes;