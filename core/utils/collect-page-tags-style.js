async function collectPageTagsStyle(usedTagsWithStyle, customTags, html) {
  const styles = [];
  
  for (let name of usedTagsWithStyle) {
    let css = await customTags[name].style;
    
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
