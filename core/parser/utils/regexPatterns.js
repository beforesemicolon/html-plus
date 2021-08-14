module.exports = {
  tagPattern: /<!--([^]*?)-->|<(\/|!)?([a-z][\w-.:]*)((?:\s+#?[a-z][\w-.:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)+\s*|\s*)(\/?)>/ig,
  attrPattern: /(#?[a-z][\w-.:]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig,
  specificAttrPattern: (name) => new RegExp(`(#?${name})(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|(\\S+)))?`, 'ig'),
  selfClosingPattern: /^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|doctype$/i,
}
