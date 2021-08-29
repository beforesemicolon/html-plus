const chalk = require("chalk");

function Log(node) {
  let value = node.getAttribute('value');
  
  if (node.context.hasOwnProperty(value)) {
    value = node.context[value];
  } else if(node.context.$data?.hasOwnProperty(value)) {
    value = node.context.$data[value];
  } else if(value === '$context') {
    value = node.context;
  } else {
    value = null;
  }
  
  return () => {
    const msg = (node.innerHTML);
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
