const vm = require('vm');

module.exports.executeCode = (executableString = '', contextData = {}, timeout = 10000) => {
  vm.createContext(contextData);
  const script = new vm.Script(executableString);
  
  return script.runInContext(contextData, {timeout});
}