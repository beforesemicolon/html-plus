/**
 * takes a argument name and throws an error that it is required
 * @param argName
 */
function required(argName = 'param') {
  throw new Error(`"${argName}" is required argument`)
}

module.exports.required = required;
