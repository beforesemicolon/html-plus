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
  get selectors() {
    return /(\+|\~|\>|\*)|:([a-z][a-z-]*)(?:\(([^)]*)\))?|\[\s*([a-z][\w:.-]*)\s*(?:\s*(\*|\||\^|\$|\~)?\s*=\s*"([^"]*)")?\s*(i|s)?\s*\]|(?:#|\.)?([a-z][\w-]*)|(?<=[^>+~\s])([ \t]+)(?=[^>+~\s])/gi
  },
  get pseudoClass() {
    return /:(root|not|disabled|enabled|checked|blank|read-only|read-write|required|optional|empty|nth-last-child|nth-child|first-child|last-child|only-child|nth-of-type|nth-last-of-type|first-of-type|last-of-type|only-of-type)/
  },
}
