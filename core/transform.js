const {HTMLNode} = require("./HTMLNode");
const {defaultAttributesMap} = require("./default-attributes");
const {defaultTagsMap} = require("./default-tags");
const {parse} = require('node-html-parser');
const {minify} = require('html-minifier');
const {turnCamelOrPascalToKebabCasing} = require("./utils/turn-camel-or-pascal-to-kebab-casing");
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");

const defaultOptions = {
  env: 'development',
  data: {},
  customTags: [],
  customAttributes: [],
  fileObject: null,
  rootNode: null,
  onTraverse() {},
  partialFileObjects: [],
};

async function transform(content, options = defaultOptions) {
  if (!content || typeof content !== 'string') return '';
  content = content.replace(/\s+/, ' ');
  
  options = {...defaultOptions, ...options};
  
  const parsedHTML = parse(replaceSpecialCharactersInHTML(content));
  parsedHTML.context = {};
  
  const customTagsMap = options.customTags.reduce((acc, tag) => {
    const tagName = turnCamelOrPascalToKebabCasing(tag.name);
    acc[tagName] = tag;
    return acc;
  }, {})
  
  const customAttributesMap = options.customAttributes.reduce((acc, attribute) => {
    const attr = turnCamelOrPascalToKebabCasing(attribute.name);
    acc[attr] = attribute.toString().startsWith('class') ? new attribute() : attribute();
    return acc;
  }, {})
  
  const node = new HTMLNode(parsedHTML, {
    ...options,
    customTags: {...customTagsMap, ...defaultTagsMap},
    customAttributes: {...customAttributesMap, ...defaultAttributesMap}
  })
  
  const html = (await node.render()).trim();
  
  if (options.env === 'production') {
    return minify(html, {
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      customAttrAssign: true,
      decodeEntities: true,
      minifyCSS: true,
      removeComments: true,
      removeRedundantAttributes: true
    })
  }
  
  return html;
}

module.exports.transform = transform;