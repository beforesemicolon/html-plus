const {parse} = require('node-html-parser');
const {minify} = require('html-minifier');
const {createTagName} = require("./utils/create-tag-name");
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
const {HTMLNode} = require("./HTMLNode");
const {customTags} = require('./custom-tags');

const defaultOptions = {
  env: 'development',
  data: {},
  customTags: [],
  fileObject: null,
  onTraverse() {},
  partialFileObjects: [],
};

async function transform(content, options = defaultOptions) {
  if (!content || typeof content !== 'string') return '';
  content = content.replace(/\s+/, ' ');
  
  options = {...defaultOptions, ...options};
  
  const parsedHTML = parse(replaceSpecialCharactersInHTML(content));
  parsedHTML.context = {};
 
  const customTagsMap = [...customTags, ...options.customTags].reduce((acc, tag) => {
    const tagName = createTagName(tag.name);
    acc[tagName] = tag;
    return acc;
  }, {})
  
  const rootNode = new HTMLNode(parsedHTML, {
    ...options,
    rootChildren: null,
    customTags: customTagsMap,
    rootNode: null
  });
  
  const html = (await rootNode.render()).trim();
  
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