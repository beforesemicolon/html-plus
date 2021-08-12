module.exports = {
  tagPattern: /<!--([^]*?(?=-->))-->|<(\/|!)?([a-z][-.:0-9_a-z]*)((?:\s+#?\w+(?:\s*=\s*(?:"[^"]+"|'[^']*'))?)+\s*|\s*)(\/?)>/ig,
  attrPattern: /(#?[a-z][a-z0-9-_:]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig,
  selfClosingPattern: /^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|doctype$/,
}
