const {HTMLNode} = require("./parser/HTMLNode");
const {defaultAttributesMap} = require("./parser/default-attributes");
const {defaultTagsMap} = require("./parser/default-tags");
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
  
  const node = new HTMLNode(content, {
    ...options,
    customTags: {...customTagsMap, ...defaultTagsMap},
    customAttributes: {...customAttributesMap, ...defaultAttributesMap},
    defaultTags: defaultTagsMap,
    defaultAttributes: defaultAttributesMap,
  })
  
  return (node.render()).trim();
}

module.exports.transform = transform;
