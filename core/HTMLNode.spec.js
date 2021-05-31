const {defaultAttributesMap} = require("./default-attributes");
const {renderChildren} = require("../index");
const {composeTagString} = require("../index");
const {Tag} = require("../index");
const {HTMLNode} = require("./HTMLNode");

describe('HTMLNode', () => {
  it('should create with minimal detail and default options', () => {
    const node = new HTMLNode({
      rawTagName: 'h1',
      parentNode: null,
      attributes: {id: 'main-title'},
      childNodes: [
        {rawText: 'my title'}
      ],
      innerHTML: 'my title'
    })
    
    expect(node.tagName).toEqual('h1');
    expect(node.attributes).toEqual({id: "main-title"});
    expect(node.context).toEqual({});
    expect(node.children).toBeInstanceOf(Function);
    return expect(node.render()).resolves.toEqual('<h1 id="main-title">my title</h1>');
  });
  
  describe('should create a ul node', () => {
    const ul = {
      rawTagName: 'ul',
      parentNode: null,
      childNodes: [],
      attributes: {class: 'list-items'},
      innerHTML: '<li class="item">item 1</li><li class="item">item 2</li><li class="item">item 3</li>'
    };
    const li1 = {
      rawTagName: 'li',
      parentNode: ul,
      attributes: {class: 'item'},
      childNodes: [
        {rawText: 'item 1'}
      ],
      innerHTML: 'item 1'
    };
    const li2 = {
      rawTagName: 'li',
      parentNode: ul,
      attributes: {class: 'item'},
      childNodes: [
        {rawText: 'item 2'}
      ],
      innerHTML: 'item 2'
    };
    const li3 = {
      rawTagName: 'li',
      parentNode: ul,
      attributes: {class: 'item'},
      childNodes: [
        {rawText: 'item 3'}
      ],
      innerHTML: 'item 3'
    };
  
    ul.childNodes.push(li1);
    ul.childNodes.push(li2);
    ul.childNodes.push(li3);
  
    it('and its child nodes', () => {
      const node = new HTMLNode(ul);
  
      expect(node.tagName).toEqual('ul');
      expect(node.attributes).toEqual({class: "list-items"});
      expect(node.context).toEqual({});
      expect(node.children()).toEqual(expect.arrayContaining([
        expect.any(HTMLNode),
        expect.any(HTMLNode),
        expect.any(HTMLNode),
      ]));
    });
    
    it('and render', () => {
      const node = new HTMLNode(ul);
  
      return expect(node.render()).resolves.toEqual('<ul class="list-items"><li class="item">item 1</li>' +
        '<li class="item">item 2</li>' +
        '<li class="item">item 3</li></ul>');
    });
  });
  
  describe('should create custom tags', () => {
    const htmlNode = {
      rawTagName: 'title',
      parentNode: null,
      attributes: {type: 'small'},
      childNodes: [
        {rawText: 'My title'}
      ],
      innerHTML: 'My title'
    };
    
    class Title extends Tag {
      async render() {
        const content = await this.renderChildren();
        
        let tagName = 'h1';
        
        switch (this.attributes.type) {
          case 'xl':
          case 'xlarge':
            tagName = 'h2';
            break;
          case 'l':
          case 'large':
            tagName = 'h3';
            break;
          case 'm':
          case 'medium':
            tagName = 'h4';
            break;
          case 's':
          case 'small':
            tagName = 'h5';
            break;
          case 'xm':
          case 'xsmall':
            tagName = 'h6';
            break;
        }
  
        return composeTagString({...this, tagName}, content)
      }
    }
    
    function title(info) {
      const {children, attributes} = info;
      
      return async () => {
        const content = await renderChildren(children);
  
        let tagName = 'h1';
  
        switch (attributes.type) {
          case 'xl':
          case 'xlarge':
            tagName = 'h2';
            break;
          case 'l':
          case 'large':
            tagName = 'h3';
            break;
          case 'm':
          case 'medium':
            tagName = 'h4';
            break;
          case 's':
          case 'small':
            tagName = 'h5';
            break;
          case 'xm':
          case 'xsmall':
            tagName = 'h6';
            break;
        }
  
        return composeTagString({attributes, tagName}, content, attributes)
      };
    }
    
    it('from class', () => {
      const node = new HTMLNode(htmlNode, {customTags: {'title': Title}});
  
      return expect(node.render()).resolves.toEqual('<h5>My title</h5>');
    });
    
    it('from function', () => {
      htmlNode.attributes.type = 'm';
      const node = new HTMLNode(htmlNode, {customTags: {'title': title}});
  
      return expect(node.render()).resolves.toEqual('<h4>My title</h4>');
    });
  });
  
  describe('should handle custom attributes', () => {
    it.todo('from class')
    
    it.todo('from function')
  })
});