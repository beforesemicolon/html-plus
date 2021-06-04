const {Attribute} = require("../Attribute");

class Repeat extends Attribute {
  process(expression, data = {}) {
    if (/^\d+$/g.test(expression.trim())) {
      return Number(expression);
    }
    
    if (expression.match(/(.+)(?=as\s+[a-zA-Z_][a-zA-Z0-9_$]?)?/g)) {
      const [dataKey, name] = expression.trim().split('as');
      this.itemName = (name || 'item').trim();
      let list = data[dataKey.trim()];
      
      if (!list && /Set|Map|Object|Array|^\[|^\{/g.test(dataKey.trim())) {
        try {
          list = eval(`(${dataKey.trim()})`);
        } catch (e) {
          throw new Error(`Failed to process #repeat attribute for value "${expression}": ` + e.message);
        }
      }
      
      return list
        ? list instanceof Map || list instanceof Set
          ? Array.from(list.entries())
          : typeof list === 'object' ? Object.entries(list) : []
        : [];
    }
    
    return null;
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
    } else if (value && Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const [key, data] = value[i];
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