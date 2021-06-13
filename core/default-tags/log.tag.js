const chalk = require("chalk");

function Log(node, options) {
  let value = node.attributes.value;
  
  if (node.context.hasOwnProperty(value)) {
    value = node.context[value];
  } else if(options.data.hasOwnProperty(value)) {
    value = options.data[value];
  } else {
    value = null;
  }
  
  return async () => {
    const msg = (await node.renderChildren()) || 'log';
    let result = ''
    
    try {
      result = value && typeof value === 'object'
        ? JSON.stringify({_: value}, null, 2)
        : `${value}`;
    } catch (e) {
      result = e.message;
    }
    
    console.log(`\n${chalk.green(msg)}:\n${result}`);
    
    return `<p>${msg}</p><pre style="overflow: scroll">${result}</pre>`;
  };
}

module.exports.Log = Log;