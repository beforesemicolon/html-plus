// const {handleError} = require("./handle-error");
// const {renderByAttribute} = require("./render-by-attribute");
// const {createCustomTag} = require("./create-custom-tag");
// const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
// const {TextNode, CommentNode, parse} = require("node-html-parser");
// const {composeTagString} = require("./compose-tag-string");
// const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
// const {processNodeAttributes} = require("./utils/process-node-attributes");
const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {Node} = require('./Node');
const {Attributes} = require('./Attributes');
const {Attr} = require('./Attr');
const {attrPattern, selfClosingPattern, tagPattern, specificAttrPattern} = require('./utils/regexPatterns');

// const defaultOptions = {
//   env: 'development',
//   data: {},
//   context: {},
//   rootNode: null,
//   customTags: {},
//   defaultTags: {},
//   customAttributes: {},
//   file: null,
//   onBeforeRender() {
//   },
//   partialFiles: [],
// };
//
// class HTMLNode {
//   #node = null;
//   #tag = null;
//   #options = {};
//
//   constructor(htmlString, options) {
//     options = {...defaultOptions, ...options}
//     this.#node = typeof htmlString === 'string'
//       ? parse(replaceSpecialCharactersInHTML(htmlString), {
//         comment: true
//       })
//       : htmlString;
//     this.#node.context = {...this.#node.context, ...options.context};
//     this.#options = options;
//     this.#tag = options.defaultTags[this.#node.rawTagName] || options.customTags[this.#node.rawTagName];
//     this.attributes = this.#node.attributes;
//
//     this.#node.getContext = () => {
//       return {...this.#node.parentNode?.getContext(), ...(this.#node.context ?? {})};
//     }
//
//     // need to process custom tag early so any context that is set
//     // is kept and used to update the nodes before it gets to rendering
//     if (this.#tag) {
//       try {
//         this.attributes = processNodeAttributes(
//           this.#node.attributes,
//           this.#tag.customAttributes,
//           {$data: this.#options.data, ...this.context}
//         );
//
//         this.#tag = createCustomTag(this.#tag, this.#node, this, this.#options);
//       } catch (e) {
//         handleError(e, this.#node, this.#options);
//       }
//     }
//   }
//
//   get type() {
//     return 'node';
//   }
//
//   get tagName() {
//     return this.#node.rawTagName
//   }
//
//   get context() {
//     return this.#node.getContext();
//   }
//
//   get innerHTML() {
//     return undoSpecialCharactersInHTML(this.#node.innerHTML);
//   }
//
//   get rawAttributes() {
//     return this.#node.rawAttrs;
//   }
//
//   get _options() {
//     return this.#options;
//   }
//
//   clone() {
//     const outerHTML = this.tagName
//       ? composeTagString(this, this.#node.innerHTML)
//       : `<fragment>${this.#node.outerHTML}</fragment>`;
//     const clonedNode = (parse(outerHTML, {
//       comment: true
//     })).childNodes[0];
//
//     clonedNode.context = {...this.#node.context};
//     clonedNode.parentNode.getContext = () => ({})
//
//     return new HTMLNode(clonedNode, this.#options);
//   }
//
//   duplicate(context = {}) {
//     const outerHTML = this.tagName
//       ? composeTagString(this, this.#node.innerHTML)
//       : `<fragment>${this.#node.outerHTML}</fragment>`;
//     const clonedNode = parse(outerHTML, {
//       comment: true
//     }).childNodes[0];
//
//     clonedNode.context = {...this.#node.context, ...context};
//     clonedNode.parentNode = this.#node.parentNode;
//
//     if (clonedNode.parentNode) {
//       const index = clonedNode.parentNode.childNodes.indexOf(this.#node);
//
//       if (index >= 0) {
//         this.#node.parentNode.childNodes.splice(index, 0, clonedNode)
//       } else {
//         this.#node.parentNode.appendChild(clonedNode)
//       }
//     }
//
//     return new HTMLNode(clonedNode, this.#options);
//   }
//
//   setAttribute(key, value) {
//     if (typeof key === 'string' && typeof value === 'string') {
//       this.#node.setAttribute(key, value);
//       const processAttrs = processNodeAttributes(
//         {[`${key}`]: value},
//         this.#tag ? this.#tag.customAttributes : {},
//         {$data: this.#options.data, ...this.context}
//       );
//
//       this.attributes[key] = processAttrs[key];
//     }
//   }
//
//   removeAttribute(key) {
//     if (typeof key === 'string') {
//       this.#node.removeAttribute(key);
//       delete this.attributes[key];
//     }
//   }
//
//   setContext(key, value = null) {
//     if (typeof key === 'string') {
//       this.#node.context[key] = value
//     }
//   }
//
//   removeContext(key) {
//     if (typeof key === 'string') {
//       delete this.#node.context[key];
//     }
//   }
//
//   #childNodes(data = {}) {
//     return this.#node.childNodes.map(childNode => {
//       if (childNode instanceof TextNode) {
//         return new Text(childNode.rawText, {
//           $data: this.#options.data,
//           ...this.context,
//           ...childNode.context,
//           ...data
//         });
//       }
//
//       if (childNode instanceof CommentNode) {
//         return new Comment(childNode.rawText);
//       }
//
//       return new HTMLNode(childNode, this.#options);
//     })
//   }
//
//   childNodes(data) {
//     return this.#childNodes(data);
//   }
//
//   renderChildren(data = {}) {
//     const renderList = this.#childNodes(data);
//     return renderList.join('');
//   }
//
//   #render() {
//     let result = '';
//     if (this.#node.rawAttrs.length && /\s?#[a-zA-Z][a-zA-Z-]+/g.test(this.#node.rawAttrs)) {
//       result = renderByAttribute(this, this.#options);
//
//       if (typeof result === 'string') {
//         return result
//       }
//     }
//
//     if (this.#tag) {
//       this.#onBeforeRender();
//
//       return this.#options.defaultTags[this.tagName]
//         ? this.#tag.render()
//         : composeTagString({tagName: this.tagName, attributes: {}, _options: this.#options}, this.#tag.render(), Object.keys(this.#options.customAttributes));
//     }
//
//     try {
//       this.attributes = processNodeAttributes(
//         this.#node.attributes,
//         {},
//         {$data: this.#options.data, ...this.context}
//       );
//     } catch (e) {
//       handleError(e, this.#node, this.#options);
//     }
//
//     this.#onBeforeRender();
//
//     return (this.tagName
//         ? composeTagString(this, this.renderChildren(), Object.keys(this.#options.customAttributes))
//         : this.renderChildren()
//     ).trim();
//   }
//
//   #onBeforeRender() {
//     if (typeof this.#options.onBeforeRender === 'function') {
//       try {
//         this.#options.onBeforeRender(this, this.#options.file);
//       } catch (e) {
//         console.error('Error in before rendering callback', e);
//       }
//     }
//   }
//
//   render() {
//     try {
//       return this.#render();
//     } catch (e) {
//       handleError(e, this.#node, this.#options);
//     }
//   }
//
//   toString() {
//     try {
//       return this.#render();
//     } catch (e) {
//       handleError(e, this.#node, this.#options);
//     }
//   }
// }

class HTMLNode extends Node {
  #tagName;
  #attributes = null;
  #textContent = '';
  #childNodes = [];
  
  constructor(tagName = null, attributeString = '') {
    super();
    this.#tagName = tagName;
    this.#attributes = new Attributes(attributeString);
  }
  
  get tagName() {
    return this.#tagName;
  }
  
  get nodeName() {
    return this.#tagName;
  }
  
  get attributes() {
    return this.#attributes;
  }
  
  get childNodes() {
    return Object.freeze([...this.#childNodes]);
  }
  
  get children() {
    return this.#childNodes.filter(node => node instanceof HTMLNode);
  }
  
  get innerHTML() {
    return this.#childNodes.join('');
  }
  
  set innerHTML(value) {
    this.#childNodes = parseHTMLString(value).childNodes.map(node => {
      node.parentNode = this;
      return node;
    });
  }
  
  get textContent() {
    return this.#textContent;
  }
  
  set textContent(value) {
    this.#textContent = value.replace(tagPattern, '');
    const content = new Text(this.#textContent);
    content.parentNode = this;
    this.#childNodes = [content];
  }
  
  hasAttributes() {
    return this.attributes.length > 0;
  }
  
  hasAttribute(name) {
    return this.attributes.toString().match(specificAttrPattern(name)) !== null;
  }
  
  setAttribute(name, value = null) {
    if (typeof name === 'string') {
      const attr = value ? `${name}="${value}"` : name;
      this.#attributes = new Attributes(`${this.attributes} ${attr}`)
    }
  }
  
  setAttributeNode(attr) {
    if (attr instanceof Attr) {
      this.setAttribute(attr.name, attr.value);
    }
  }
  
  getAttributeNames() {
    return [...this.attributes].map(attr => attr.name);
  }
  
  getAttribute(name) {
    return this.getAttributeNode(name).value
  }
  
  getAttributeNode(name) {
    return this.attributes.getNamedItem(name)
  }
  
  removeAttribute(name) {
    this.#attributes = new Attributes(this.attributes.toString().replace(specificAttrPattern(name), ''))
  }
  
  removeAttributeNode(attr) {
    if (attr instanceof Attr) {
      this.removeAttribute(attr.name)
    }
  }
  
  appendChild(node) {
    if (isValidNode(node)) {
      this.#childNodes.push(node)
      node.parentNode = this;
    }
  }
  
  removeChild(node) {
    if (isValidNode(node)) {
      this.#childNodes.splice(this.#childNodes.indexOf(node), 1);
    }
  }
  
  replaceChild(newNode, oldNode) {
    if (isValidNode(newNode) && isValidNode(oldNode)) {
      this.#childNodes.splice(this.#childNodes.indexOf(oldNode), 1, newNode);
    }
  }
  
  toString() {
    if (this.tagName === null) {
      return this.childNodes.join('');
    }
    
    const isSelfClosing = selfClosingPattern.test(this.tagName);
    let tag = `<${this.tagName} ${this.#attributes}`.trim();
    
    if (isSelfClosing) {
      tag = tag.trim() + '/>'
    } else {
      tag = tag.trim() + `>${this.childNodes.join('')}</${this.tagName}>`;
    }
    
    return tag;
  }
}

function isValidNode(node) {
  return node instanceof HTMLNode || node instanceof Text || node instanceof Comment;
}

function parseHTMLString(markup, callback = null) {
  callback = typeof callback === 'function' ? callback : (() => null);
  
  const root = new HTMLNode();
  const stack = [root];
  let match;
  let lastIndex = 0;
  
  while ((match = tagPattern.exec(markup)) !== null) {
    const [tag, comment, closeOrBang, tagName, attributes] = match;
    
    const parentNode = stack[stack.length - 1] || null;
    
    // grab in between text
    if (lastIndex !== match.index) {
      const text = new Text(markup.slice(lastIndex, match.index))
      callback(text);
      parentNode.appendChild(text);
    }
    
    lastIndex = tagPattern.lastIndex;
    
    if (comment) {
      const com = new Comment(comment);
      callback(com);
      parentNode.appendChild(com);
      continue;
    }
    
    const isSelfClosing = selfClosingPattern.test(tagName);
    const isClosedTag = stack[stack.length - 1].tagName === tagName;
    
    if (isSelfClosing) {
      const node = new HTMLNode(tagName, attributes);
      callback(node);
      parentNode.appendChild(node);
    } else if (isClosedTag) {
      callback(stack[stack.length - 1]);
      stack.pop();
    } else if (!closeOrBang) {
      const node = new HTMLNode(tagName, attributes);
      parentNode.appendChild(node);
      stack.push(node)
    }
  }
  
  // grab ending text
  if (lastIndex < markup.length) {
    const text = new Text(markup.slice(lastIndex));
    callback(text);
    root.appendChild(text, root);
  }
  
  return root;
}

module.exports.parseHTMLString = parseHTMLString;
module.exports.HTMLNode = HTMLNode;
module.exports.Attributes = Attributes;

