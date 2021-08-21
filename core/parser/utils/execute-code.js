module.exports.executeCode = (executableString = '', contextData = {}, timeout = 10000) => {
  const fn = new Function(...Object.keys(contextData), `return ${executableString}`);
  
  return fn.apply(contextData, Object.values(contextData));
}
