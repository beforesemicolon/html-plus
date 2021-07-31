async function injectTagStylesToPage(html, styles) {
  const endOfHeadPattern = /<\/head>/gm;
  
  return html.replace(endOfHeadPattern, m => {
    return `${styles.map((css) => `<style>${css}</style>`.replace(/\s{2,}/g, '')).join('\n')}${m}`;
  })
}

module.exports.injectTagStylesToPage = injectTagStylesToPage;
