const {isString} = require("util");
const {HTMLNode} = require("./parser/HTMLNode");
const {defaultAttributesMap} = require("./default-attributes");
const {defaultTagsMap} = require("./default-tags");
const {turnCamelOrPascalToKebabCasing} = require("./utils/turn-camel-or-pascal-to-kebab-casing");

const defaultOptions = {
  env: 'development',
  data: {},
  context: {},
  customTags: [],
  customAttributes: [],
  file: null,
  onBeforeRender() {
  },
  partialFiles: [],
};

async function transform(content, options = defaultOptions) {
  if (content && typeof content === 'object') {
    options = content;
    
    if (!options.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
    
    options.file.load();
    
    content = options.file.content;
  }
  
  content = content.replace(/\s+/, ' ');
  options = {...defaultOptions, ...options, rootNode: null};
  
  const styles = [];
  
  const customTagsMap = options.customTags.reduce((acc, tag) => {
    const tagName = turnCamelOrPascalToKebabCasing(tag.name);
    acc[tagName] = tag;
    return acc;
  }, {});
  
  const customAttributesMap = options.customAttributes.reduce((acc, attribute) => {
    const attr = turnCamelOrPascalToKebabCasing(attribute.name);
    acc[attr] = attribute;
    return acc;
  }, {});
  
  const customTags = {...customTagsMap, ...defaultTagsMap};
  const customAttributes = {...customAttributesMap, ...defaultAttributesMap};
  
  // collect tag associated styles
  for (let name in customTags) {
    const style = await customTags[name].style;
    
    // only collect the style if the tag is actually used
    if (isString(style) && new RegExp(`<${name}[^>]*>`, 'g').test(content)) {
      let css = style;
      
      if (style.trim().startsWith('<style')) {
        css = style.match(/<style[^>]*>(.*)<\/?style>/s)[1];
      }
      
      styles.push(`<style id="${name}-tag">${css}</style>`);
    }
  }
  
  const node = new HTMLNode(content, {...options, customTags, customAttributes})
  
  let html = (node.render()).trim();
  
  // include the collected styles at the end of the head tag
  if (styles.length) {
    const endOfHeadPattern = /<\/head[^>]*>/gm;
    
    if (endOfHeadPattern.test(html)) {
      html = html.replace(endOfHeadPattern, m => {
        return `${styles.join('\n')}${m}`;
      })
    }
  }
  
  return html;
}

module.exports.transform = transform;
