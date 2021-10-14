const {CustomAttribute} = require("./CustomAttribute");
const {Element} = require("./../Element");
const {customAttributesRegistry} = require("./CustomAttributesRegistry");

class Repeat extends CustomAttribute {
  execute = true;
  itemName = '$item';
  
  process(expression) {
    if (/^\d+$/g.test(expression.trim())) {
      return Number(expression);
    }
    
    if (expression.match(/(.+)(?=as\s+[a-zA-Z_][a-zA-Z0-9_$]?)?/g)) {
      const [dataKey, name] = expression.trim().split('as');
      this.itemName = (name || '').trim() || '$item';
      
      return dataKey.trim();
    }
    
    return '[]';
  }
  
  render(value, node) {
    const repeatedNodes = [];
    
    if (typeof value === "number") {
      for (let i = 0; i < value; i++) {
        const nodeCopy = node.cloneNode(true);
        nodeCopy.setContext('$index', i);
        nodeCopy.setContext('$key', i);
        nodeCopy.setContext('$item', i + 1);
        
        repeatedNodes.push(nodeCopy);
      }
    } else if (value && typeof value === 'object') {
      const list = /Set|Map/.test(value.toString())
        ? Array.from(value.entries())
        : typeof value === 'object'
          ? Object.entries(value)
          : []
      
      for (let i = 0; i < list.length; i++) {
        const [key, data] = list[i];
        const nodeCopy = node.cloneNode(true);
        nodeCopy.setContext('$index', i);
        nodeCopy.setContext('$key', key);
        nodeCopy.setContext(`${this.itemName}`, data);
        
        repeatedNodes.push(nodeCopy);
      }
    }
    
    if (repeatedNodes.length) {
      const frag = new Element();
      frag.context = node.selfContext;
      node.parentNode.replaceChild(frag, node);
      
      repeatedNodes.forEach(n => {
        frag.appendChild(n);
      });
      
      return frag;
    }
    
    return node;
  }
}

customAttributesRegistry.define('repeat', Repeat);

module.exports.Repeat = Repeat;
