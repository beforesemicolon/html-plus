const turnKebabToCamelCasing = str => str
  .match(/\w+/g)
  .map((p, i) => i === 0 ? p : p[0].toUpperCase() + p.slice(1))
  .join('');

module.exports.turnKebabToCamelCasing = turnKebabToCamelCasing;