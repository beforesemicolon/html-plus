const createTagName = name => {
  return name.match(/(^|[A-Z])[^A-Z]+/g).map(p => p.toLowerCase()).join('-')
}

module.exports.createTagName = createTagName;