const chalk = require("chalk");
const {executeCode} = require("./utils/execute-code");
const {turnCamelOrPascalToKebabCasing} = require("./utils/turn-camel-or-pascal-to-kebab-casing");
const {bindData} = require("./utils/bind-data");
const {TextNode} = require("node-html-parser");
const {composeTagString} = require("./utils/compose-tag-string");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {processNodeAttributes} = require("./utils/process-node-attributes");

const defaultOptions = {
  env: 'development',
  data: {},
  rootNode: null,
  customTags: [],
  customAttributes: [],
  fileObject: null,
  onTraverse() {
  },
  partialFileObjects: [],
};

class HTMLNode {
  #node = null;
  #tag = null;
  #options = {};
  
  constructor(node, options) {
    options = {...defaultOptions, ...options}
    this.#node = node;
    this.#options = options;
    this.#tag = options.customTags[node.rawTagName];
    this.attributes = node.attributes;
    
    if (typeof options.onTraverse === 'function') {
      options.onTraverse(this);
    }
  }
  
  get tagName() {
    return this.#node.rawTagName
  }
  
  get context() {
    return this.#node.parentNode
      ? {...this.#node.parentNode.context, ...this.#node.context}
      : this.#node.context;
  }
  
  get innerHTML() {
    return undoSpecialCharactersInHTML(this.#node.innerHTML);
  }
  
  setAttribute(key, value) {
    if (typeof key === 'string' && typeof value === 'string') {
      this.#node.setAttribute(turnCamelOrPascalToKebabCasing(key), value);
      this.attributes[key] = processNodeAttributes(
        {key: value},
        this.#tag ? this.#tag.customAttributes : {},
        {...this.#options.data, ...this.#node.context}
      );
    }
  }
  
  removeAttribute(key) {
    if (typeof key === 'string') {
      this.#node.removeAttribute(turnCamelOrPascalToKebabCasing(key));
      delete this.attributes[key];
    }
  }
  
  setContext(key, value = null) {
    if (typeof key === 'string') {
      this.#node.context[key] = value
    }
  }
  
  removeContext(key) {
    if (typeof key === 'string') {
      delete this.#node.context[key];
    }
  }
  
  childNodes(data) {
    return this.#node.childNodes.map(childNode => {
      childNode.context = {...this.context, ...childNode.context, ...data}
      return childNode instanceof TextNode
        ? bindData(childNode.rawText, {...this.#options.data, ...childNode.context})
        : new HTMLNode(childNode, this.#options)
    })
  }
  
  renderChildren(data = {}) {
    return Promise.all(
      this.#node.childNodes.map(childNode => {
        childNode.context = {...this.context, ...childNode.context, ...data}
        
        return childNode instanceof TextNode
          ? new TextNode(bindData(childNode.rawText, {...this.#options.data, ...childNode.context}))
          : (new HTMLNode(childNode, this.#options)).render()
      })
    ).then(res => res.join(''));
  }
  
  async render() {
    try {
      if (this.#node.rawAttrs.length && /^|\s#[a-zA-Z][a-zA-Z-]+/g.test(this.#node.rawAttrs)) {
        const result = await renderByAttribute(this, this.#options);
    
        if (result === null) {
          return '';
        }
    
        if (typeof result === 'string') {
          return result;
        }
      }
  
      const customAttributes = this.#tag ? this.#tag.customAttributes : {}
      this.attributes = processNodeAttributes(
        this.#node.attributes,
        customAttributes,
        {...this.#options.data, ...this.#node.context}
      );
  
      return (this.#tag
          ? await renderCustomTag(this.#tag, this.#node, this, this.#options)
          : this.tagName
            ? composeTagString(this, await this.renderChildren(this.context), Object.keys(this.#options.customAttributes))
            : await this.renderChildren(this.context)
      ).trim();
    } catch(e) {
      console.error('render failed', e);
      handleError(e, this.#node, this.#options);
    }
  }
}

async function renderByAttribute(node, options) {
  for (let attr of new Set(['if', 'repeat', 'fragment', ...Object.keys(options.customAttributes)])) {
    if (node.attributes[attr] && options.customAttributes[attr]) {
      let value = undoSpecialCharactersInHTML(node.attributes[attr]);
      const handler = options.customAttributes[attr];
      const data = {...options.data, ...node.context};
      
      if (handler.bind) {
        value = executeCode(`(() => (${value}))()`, data);
      }
      
      if (typeof handler.process === 'function') {
        value = handler.process(value, data);
      }
      
      node.removeAttribute(attr)
      console.log('-- value', value);
      const result = await handler.render(value, node);
      
      if (result === null || typeof result === 'string') {
        return result;
      }
    }
  }
  
  return node;
}

async function renderCustomTag(tag, rawNode, node, nodeOptions) {
  let instance = () => '';
  const {customTags, customAttributes, onTraverse, ...opt} = nodeOptions
  
  const options = {
    ...opt,
    get partialFileObjects() {
      return opt.partialFileObjects.map(file => {
        // partial files are created outside the context of the node, therefore
        // the file root node needs to be update with the current node
        file.options = {...nodeOptions, rootNode: node};
        
        return file;
      })
    }
  }
  
  if (tag.toString().startsWith('class')) {
    instance = new tag(node, options)
  } else {
    instance = tag(node, options);
  }
  
  if (Object.keys(rawNode.context ?? {}).length) {
    const parentChildNodes = rawNode.parentNode.childNodes;
    // find the current child index in its parent child nodes list
    const childIndex = parentChildNodes.indexOf(rawNode);
    
    // loop all following child and update their context
    for (let i = childIndex + 1; i < parentChildNodes.length; i++) {
      parentChildNodes[i].context = {...(parentChildNodes[i].context || {}), ...rawNode.context};
    }
  }
  
  return typeof instance === 'function'
    ? (await instance()) ?? ''
    : typeof instance.render === 'function'
      ? (await instance.render()) ?? ''
      : '';
}

function handleError(e, node, options) {
  let error = e.message;
  
  if (node instanceof TextNode) {
    throw new Error(`${error}||${node.rawText}`)
  }
  
  if (e.message && e.message.startsWith('HTML: ')) {
    throw new Error(error)
  }
  
  const [errMsg, text] = error.split('||');
  const nodeString = text
    ? ((node.parentNode || node).outerHTML).replace(text, chalk.redBright(`\n${text.trim()} <= Error: ${errMsg}\n`))
    : node.outerHTML;
  
  const fileInfo = options.fileObject
    ? `\n:File \n${chalk.yellow(options.fileObject?.filePath)}`
    : '';
  
  throw new Error(
    'HTML: ' +
    chalk.redBright(errMsg) + fileInfo +
    `\n\n:Markup \n${chalk.green(nodeString)}`
  );
}

module.exports.HTMLNode = HTMLNode;
