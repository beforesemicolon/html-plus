const turnCamelOrPascalToKebabCasing = name => {
  return name.match(/(?:[a-zA-Z]|[A-Z]+)[a-z]*/g).map(p => p.toLowerCase()).join('-')
}

module.exports.turnCamelOrPascalToKebabCasing = turnCamelOrPascalToKebabCasing;