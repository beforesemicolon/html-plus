async function injectTagStylesToPage(html, {env, styles, tagsStylesheetName}) {
  const endOfHeadPattern = /<\/head>/gm;
  
  if (env === 'development') {
    return html.replace(endOfHeadPattern, m => {
      return `${styles.map((css) => `<style>${css}</style>`).join('\n')}${m}`;
    })
  }
  
  return html.replace(endOfHeadPattern, m => {
    return `<link rel="stylesheet" href="${tagsStylesheetName}">${m}`;
  })
}

module.exports.injectTagStylesToPage = injectTagStylesToPage;
