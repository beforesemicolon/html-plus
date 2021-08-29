module.exports = {
  get tagCommentPattern() {
    return /<!--([^]*?)-->|<(\/|!)?([a-z][\w-.:]*)((?:\s+#?[a-z][\w-.:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)+\s*|\s*)(\/?)>/ig
  },
  // get tagPattern() {
  //   return /<(\/|!)?([a-z][\w-.:]*)((?:\s+#?[a-z][\w-.:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)+\s*|\s*)(\/?)>/ig
  // },
  get attrPattern() {
    return /(#?[a-z][\w-.:]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig
  },
  specificAttrPattern: (name) => new RegExp(`(#?${name})(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|(\\S+)))?`, 'ig'),
  get selfClosingPattern() {
    return /^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|doctype$/i
  },
}
