function required(argName = 'param') {
  throw new Error(`"${argName}" is required argument`)
}

module.exports.required = required;