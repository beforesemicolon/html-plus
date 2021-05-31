const {parse} = require('node-html-parser');
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {processNodeAttributes} = require("./utils/process-node-attributes");
const {TextNode} = require('./TextNode');
const {renderChildren} = require("./utils/render-children");
const {composeTagString} = require("./utils/compose-tag-string");

const defaultOptions = {
  env: 'development',
  data: {},
  customTags: {},
  customAttributes: {},
  fileObject: null,
  rootChildren: null,
  onTraverse() {
  },
  partialFileObjects: [],
};

class HTMLNode {
  #options = defaultOptions;
  #node = null;
  
  constructor(node, opt = defaultOptions) {
    opt = {...defaultOptions, ...opt};
    const tag = opt.customTags[node.rawTagName];
    this.#options = opt;
    this.#node = node;
    this.tagName = node.rawTagName || null;
    this.context = node.parentNode
      ? {...node.parentNode.context, ...(node.context || {})}
      : {}
    this.attributes = processNodeAttributes(
      node,
      {...tag?.customAttributes, ...opt.customAttributes},
      {...opt.data, ...this.context}
    );
    
    if (tag) {
      const tagInfo = {
        ...opt,
        attributes: this.attributes,
        children: this.children,
        context: this.context,
        root: this,
        get innerHTML() {
          return undoSpecialCharactersInHTML(node.innerHTML);
        },
        get partialFiles() {
          return opt.partialFileObjects.map(file => {
            file.render = async (data = {}) => {
              const parsedHTML = parse(replaceSpecialCharactersInHTML(file.content));
              parsedHTML.context = {...node.context, ...data};
              const partialNode = new HTMLNode(parsedHTML, {...opt, rootChildren: this.children});
              return (await partialNode.render()).trim()
            }
            
            return file;
          })
        }
      };
      let instance = {};
      
      if (tag.toString().startsWith('class')) {
        instance = new tag(tagInfo)
      } else {
        instance = tag(tagInfo);
        
        if (typeof instance === 'function') {
          instance = {
            render: instance,
            context: {}
          }
        }
      }
      
      if (typeof opt.onTraverse === 'function') {
        opt.onTraverse(tag);
      }
      
      const prevRender = instance.render;
      instance.render = () => {
        if (renderByAttributes(instance, this.#options.customAttributes)) {
          return prevRender.call(instance);
        }

        return '';
      }
      
      // if it is a custom tag return the tag instance to be used instead
      return instance;
    }
    
    
    if (typeof opt.onTraverse === 'function') {
      opt.onTraverse(this);
    }
  }
  
  children = (data = {}) => {
    return this.#node.childNodes.map(child => {
      if (child.hasOwnProperty('rawText')) {
        return new TextNode(child, {...this.#options.data, ...this.context, ...child.context, ...data})
      } else {
        const childNode = new HTMLNode(child, this.#options);
        
        // if the child node creates a new context
        // it is necessary to make it available to it following siblings only
        if (childNode.context && Object.keys(childNode.context).length) {
          // find the current child index in its parent child nodes list
          const childIndex = this.#node.childNodes.indexOf(child);
          child.context = childNode.context;
          
          // loop all following child and update their context
          for (let i = childIndex + 1; i < this.#node.childNodes.length; i++) {
            if (this.#node.childNodes[i]) {
              this.#node.childNodes[i].context = {...(this.#node.childNodes[i].context || {}), ...child.context};
            }
          }
        }
        
        return childNode;
      }
    })
  }
  
  async render() {
    if (renderByAttributes(this, this.#options.customAttributes)) {
      if (!this.tagName) {
        return renderChildren(this.children);
      }
      
      return composeTagString(this, await renderChildren(this.children));
    }
    
    return '';
  }
}

function renderByAttributes(node, customAttributes) {
  const attrs = new Set(['if', 'repeat', 'fragment', ...Object.keys(node.attributes)]);
  
  for (let attr of attrs) {
    if (
      customAttributes[attr] &&
      node.attributes.hasOwnProperty(attr) &&
      typeof customAttributes[attr].render === 'function'
    ) {
      const result = customAttributes[attr].render(node, node.attributes[attr]);
      
      if (result === null) {
        return result;
      }
    }
  }
  
  return node;
}

module.exports.HTMLNode = HTMLNode;