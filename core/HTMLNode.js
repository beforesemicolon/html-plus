const {parse} = require('node-html-parser');
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {processNodeAttributes} = require("./utils/process-node-attributes");
const {defineGetter} = require("./utils/define-getter");
const {TextNode} = require('./TextNode');
const {renderChildren} = require("./utils/render-children");
const {composeTagString} = require("./utils/compose-tag-string");

const defaultOptions = {
  env: 'development',
  data: {},
  customTags: [],
  fileObject: null,
  rootChildren: null,
  onTraverse() {},
  partialFileObjects: [],
};

class HTMLNode {
  constructor(node, opt = defaultOptions) {
    opt = {...defaultOptions, ...opt};
    defineGetter(this, 'context', () => {
      return node.parentNode
        ? {...node.parentNode.context, ...(node.context || {})}
        : {}
    });
  
    const tag = opt.customTags[node.rawTagName];
    const name = node.rawTagName || null;
    const attributes = processNodeAttributes(node, tag?.customAttributes, {...opt.data, ...this.context});
    const children = (data = {}) => {
      return node.childNodes.map(child => {
        if (child.hasOwnProperty('rawText')) {
          return new TextNode(child, {...opt.data, ...this.context, ...child.context, ...data})
        } else {
          const childNode = new HTMLNode(child, opt);
    
          // if the child node creates a new context
          // it is necessary to make it available to it following siblings only
          if (childNode.context && Object.keys(childNode.context).length) {
            // find the current child index in its parent child nodes list
            const childIndex = node.childNodes.indexOf(child);
            child.context = childNode.context;

            // loop all following child and update their context
            for (let i = childIndex+1; i < node.childNodes.length; i++) {
              if(node.childNodes[i]) {
                node.childNodes[i].context = {...(node.childNodes[i].context || {}), ...child.context};
              }
            }
          }
    
          return childNode;
        }
      })
    }
    
    if (tag) {
      const tagInfo = {
        ...opt,
        attributes,
        children,
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
              const partialNode = new HTMLNode(parsedHTML, {...opt, rootChildren: children});
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
      
      // if it is a custom tag return the tag instance to be used instead
      return instance;
    }
  
    defineGetter(this, 'attributes', () => attributes);
    defineGetter(this, 'tagName', () => name);
    defineGetter(this, 'children', () => children);
  
    if (typeof opt.onTraverse === 'function') {
      opt.onTraverse(this);
    }
  }
  
  async render() {
    if (!this.tagName) {
      return renderChildren(this.children);
    }
  
    return composeTagString(this, await renderChildren(this.children));
  }
}

module.exports.HTMLNode = HTMLNode;