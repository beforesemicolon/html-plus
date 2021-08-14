const {Attribute} = require("../../Attribute");

class Attr extends Attribute {
  execute = true;
  names = [];
  values = [];
  
  process(expression) {
    const styles = [];
    expression = expression.replace(/(style)(?:\s*,\s*)(.+?)(?:\s*,\s*)([^,;]+?)(?:;|$)/g, (...m) => {
      styles.push(m)
      return '';
    })
  
    const otherAttrs = Array.from(expression.matchAll(/([^,]+),([^,]+)(?:$|;)|([^,]+),(.+?),([^,]+)(?:$|;)/g));
    
    return `[${[...styles, ...otherAttrs].map((m) => {
      let name, value, condition;
      if (m[1]) {
        name = m[1];
        value = m[2];
        condition = m[3];
      } else {
        name = m[3];
        value = m[4];
        condition = m[5];
      }
  
      this.names.push(name);
  
      if (!value) {
        this.values.push('');
        return 'true';
      }
  
      if (!condition) {
        condition = value;
        value = '';
      }
  
      this.values.push(value);
      return condition;
    })}]`;
  }
  
  getDelimiter(name) {
    switch (name) {
      case 'style':
        return ';';
      case 'accept':
      case 'content':
        return ',';
      default:
        return '';
    }
  }
  
  render(conditions, node) {
    this.names.forEach((name, i) => {
      name = name.trim();
      
      if (conditions[i]) {
        const value = this.values[i].trim();
        
        switch (name) {
          case 'class':
          case 'style':
          case 'content':
          case 'accept':
            if (node.hasAttribute(name)) {
              node.setAttribute(name, `${node.getAttribute(name)}${this.getDelimiter(name)} ${value}`.trim());
            } else {
              node.setAttribute(name, value);
            }
      
            break;
          default:
            node.setAttribute(name, value);
        }
      }
    });
    
    return node;
  }
}

module.exports.Attr = Attr;
