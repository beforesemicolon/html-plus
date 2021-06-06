const chalk = require("chalk");

function Log(node, options) {
  let value = node.attributes.value;
  
  value = node.context[value] ?? options.data[value] ?? node.context;
  
  return async () => {
    const msg = (await node.renderChildren()) || 'log';
    let result = ''
    
    try {
      result = value && typeof value === 'object'
        ? JSON.stringify({log: value}, null, 2)
        : `${value}`;
    } catch (e) {
      result = e.message;
    }
    
    console.log(`\n${chalk.green(msg)}:\n${result}`);
    
    return `<p>${msg}</p><pre>${result}</pre>`;
  };
}

module.exports.Log = Log;