const chalk = require("chalk");

function Log(node, options) {
  let value = node.attributes.value;
  
  if (node.context.hasOwnProperty(value)) {
    value = node.context[value];
  } else if(options.data.hasOwnProperty(value)) {
    value = options.data[value];
  } else if(value === '$context') {
    value = node.context;
  } else {
    value = null;
  }
  
  return () => {
    const msg = (node.renderChildren());
    let result = ''
    
    try {
      result = value && typeof value === 'object'
        ? JSON.stringify({value}, null, 2)
        : `${value}`;
    } catch (e) {
      result = e.message;
    }
    
    console.log(`\n${chalk.green(msg)}:\n${result}`);
    
    return (msg ? `<p>${msg}</p>` : '') + `<pre style="overflow: scroll">${result}</pre>`;
  };
}

module.exports.Log = Log;