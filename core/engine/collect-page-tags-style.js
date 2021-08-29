/**
 * check for the style property on custom tags and collect its content
 * @param usedTagsWithStyle
 * @param tagStyles
 * @returns {Promise<*[]>}
 */
async function collectPageTagsStyle(usedTagsWithStyle, tagStyles) {
  const styles = [];
  
  for (let name of usedTagsWithStyle) {
    let css = await tagStyles[name];
    
    if (css.trim().startsWith('<style')) {
      css = css.match(/<style[^>]*>(.*)<\/?style>/s)[1];
    }
    
    css = css.replace(/([^}]+)(?={)/gm, m => {
      return `\n${name} ${m.replace(/^\s+/g, '')}`;
    })
    
    styles.push(css);
  }
  
  return styles;
}

module.exports.collectPageTagsStyle = collectPageTagsStyle;
