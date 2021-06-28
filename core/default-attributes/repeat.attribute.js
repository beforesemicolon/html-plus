const {Attribute} = require("../Attribute");

class Repeat extends Attribute {
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
    let result = '';
    
    if (typeof value === "number") {
      for (let i = 0; i < value; i++) {
        const nodeCopy = node.duplicate({
          $index: i,
          $key: i,
          $item: i + 1,
        });
        
        result += nodeCopy.render();
      }
    } else if (value && typeof value === 'object') {
      const list = /Set|Map/.test(value.toString())
        ? Array.from(value.entries())
        : typeof value === 'object'
          ? Object.entries(value)
          : []
      
      for (let i = 0; i < list.length; i++) {
        const [key, data] = list[i];
        const nodeCopy = node.duplicate({
          $index: i,
          $key: key,
          [`${this.itemName}`]: data,
        });
        
        result += nodeCopy.render();
      }
    }
    
    return result || node;
  }
}

module.exports.Repeat = Repeat;