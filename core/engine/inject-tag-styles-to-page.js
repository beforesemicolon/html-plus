/**
 * puts a style tag with CSS before the end of page head tag
 * @param html
 * @param styles
 * @returns {*}
 */
function injectTagStylesToPage(html, styles) {
  const endOfHeadPattern = /<\/head>/gm;
  
  return html.replace(endOfHeadPattern, m => {
    return `${styles.map((css) => `<style>${css}</style>`.replace(/\s{2,}/g, '')).join('\n')}${m}`;
  })
}

module.exports.injectTagStylesToPage = injectTagStylesToPage;
