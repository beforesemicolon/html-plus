const {parse} = require('node-html-parser');
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
const {processNodeAttributes} = require("./utils/process-attributes");
const {defineGetter} = require("./utils/define-getter");
const {TextNode} = require('./TextNode');
const {renderChildren} = require("./utils/render-children");
const {composeTagString} = require("./utils/compose-tag-string");

class HTMLNode {
  constructor(node, opt) {
    defineGetter(this, 'context', () => {
      return node.parentNode
        ? {...node.parentNode.context, ...(node.context || {})}
        : {}
    });
    
    const name = node.rawTagName || null;
    const attributes = processNodeAttributes(node, {...opt.data, ...this.context});
    const children = (data = {}) => {
      return node.childNodes.map(child => {
        if (child.hasOwnProperty('rawText')) {
          return new TextNode(child, {...opt.data, ...this.context, ...child.context, ...data})
        } else {
          const childNode = new HTMLNode(child, opt);
    
          // if the child node creates a new context
          // it is necessary to make it available to it following siblings only
          if (Object.keys(childNode.context).length) {
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
  
    const tag = opt.customTags[node.rawTagName];
    
    if (tag) {
      const tagInfo = {
        ...opt,
        attributes,
        children,
        context: this.context,
        root: this,
        rootChildren: opt.rootChildren,
        innerHTML: node.innerHTML,
        get partialFiles() {
          return opt.partialFileObjects.map(file => ({
            ...file,
            render: async (data = {}) => {
              const parsedHTML = parse(replaceSpecialCharactersInHTML(file.content));
              parsedHTML.context = {...node.context, ...data};
              const partialNode = new HTMLNode(parsedHTML, {...opt, rootChildren: children});
              return (await partialNode.render()).trim()
            }
          }))
        }
      };
      let instance = {};
      
      if (tag.toString().startsWith('class')) {
        instance = new tag(tagInfo)
      } else {
        instance = tag(tagInfo);
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