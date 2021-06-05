const {Attribute} = require("../Attribute");

class Repeat extends Attribute {
  execute = true;
  
  process(expression) {
    if (/^\d+$/g.test(expression.trim())) {
      return Number(expression);
    }
    
    if (expression.match(/(.+)(?=as\s+[a-zA-Z_][a-zA-Z0-9_$]?)?/g)) {
      const [dataKey, name] = expression.trim().split('as');
      this.itemName = (name || 'item').trim();
      
      return dataKey.trim();
    }
    
    return '[]';
  }
  
  async render(value, node) {
    let result = '';
  
    if (typeof value === "number") {
      for (let i = 0; i < value; i++) {
        node.setContext('$index', i);
        node.setContext('$key', i);
        node.setContext('$item', i + 1);
        
        result += await node.render()
      }
    } else if (value && typeof value === 'object') {
      const list = /Set|Map/.test(value.toString())
        ? Array.from(value.entries())
        : typeof value === 'object'
          ? Object.entries(value)
          : []
      
      for (let i = 0; i < list.length; i++) {
        const [key, data] = list[i];
        node.setContext('$index', i);
        node.setContext('$key', key);
        node.setContext(`$${this.itemName}`, data);
        
        result += await node.render();
      }
    }
    
    return result || node;
  }
}

module.exports.Repeat = Repeat;