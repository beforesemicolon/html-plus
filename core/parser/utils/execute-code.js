const globals = [
  'URL',
  'URLSearchParams',
]

/**
 * simple Function based eval
 * @param executableString
 * @param contextData
 * @returns {*}
 */
module.exports.executeCode = (executableString = '', contextData = {}) => {
  const args = [...Object.keys(contextData), ...globals];
  const values = [...Object.values(contextData), ...globals.map(() => {})];
  
  const fn = new Function(...args, `return ${executableString}`);
  
  return fn.apply(contextData, values);
}
