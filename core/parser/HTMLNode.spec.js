const {HTMLElement} = require("node-html-parser");
const {composeTagString} = require("./compose-tag-string");
const {HTMLNode} = require("./HTMLNode");
const {Variable} = require("./../default-tags/variable.tag");
const {defaultTagsMap} = require("../default-tags");

describe('HTMLNode', () => {
  it('should create with minimal detail and default options', () => {
    const htmlNode = new HTMLElement('h1', {id: 'main-title'}, 'id="main-title"', null);
    htmlNode.textContent = 'my title';
    
    const node = new HTMLNode(htmlNode);
    
    expect(node.tagName).toEqual('h1');
    expect(node.attributes).toEqual({id: "main-title"});
    expect(node.context).toEqual({});
    expect(node.childNodes).toBeInstanceOf(Function);
    expect(node.renderChildren).toBeInstanceOf(Function);
    expect(node.render).toBeInstanceOf(Function);
    return expect(node.render()).toEqual('<h1 id="main-title">my title</h1>');
  });
  
  describe('should create a ul node', () => {
    const ul = new HTMLElement('ul', {class: 'list-items'});
    const li1 = new HTMLElement('li', {class: 'item'});
    li1.textContent = 'item 1';
    const li2 = new HTMLElement('li', {class: 'item'});
    li2.textContent = 'item 2';
    const li3 = new HTMLElement('li', {class: 'item'});
    li3.textContent = 'item 3';
  
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
  
    const node = new HTMLNode(ul);
  
    it('and its child nodes', () => {
      expect(node.tagName).toEqual('ul');
      expect(node.attributes).toEqual({class: "list-items"});
      expect(node.context).toEqual({});
      expect(node.childNodes()).toEqual(expect.arrayContaining([
        expect.any(HTMLNode),
        expect.any(HTMLNode),
        expect.any(HTMLNode),
      ]));
    });
    
    it('and render', () => {
      return expect(node.render()).toEqual('<ul class="list-items"><li class="item">item 1</li><li class="item">item 2</li><li class="item">item 3</li></ul>');
    });
  });
  
  describe('should handle custom tags', () => {
    const htmlNode = new HTMLElement('title', {});
    htmlNode.textContent = 'My title';
    htmlNode.setAttribute('type', 'small')
    
    class Title {
      constructor(node, options) {
        this.node = node;
      }
      
      render() {
        const content = this.node.renderChildren();
        
        let tagName = 'h1';
        switch (this.node.attributes.type) {
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
  
        return composeTagString({...this.node, tagName}, content, Object.keys(this.node.attributes))
      }
    }
    
    function title(node) {
      return () => {
        const content = node.renderChildren();

        let tagName = 'h1';

        switch (node.attributes.type) {
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

        return composeTagString({...node, tagName}, content, Object.keys(node.attributes))
      };
    }
    
    it('from class', () => {
      const node = new HTMLNode(htmlNode, {customTags: {'title': Title}});
  
      return expect(node.render()).toEqual('<h5>My title</h5>');
    });
    
    it('from function', () => {
      htmlNode.setAttribute('type', 'm')
      const node = new HTMLNode(htmlNode, {customTags: {'title': title}});

      return expect(node.render()).toEqual('<h4>My title</h4>');
    });
  });
  
  describe('should handle custom attributes', () => {
    it.todo('from class')
    
    it.todo('from function')
  });
  
  describe('should clone', () => {
    it('without context', () => {
      const el = '<li>item</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap});
      const nodeClone = node.clone();
      
      expect(node.render()).toEqual('<li>item</li>')
      expect(nodeClone.render()).toEqual('<li>item</li>')
    })
  
    it('with context', () => {
      const el = '<li>{item}</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap});
      node.setContext('item', 'my item')
      const nodeClone = node.clone();
      nodeClone.setContext('item', 'my cloned item')
    
      expect(node.render()).toEqual('<li>my item</li>')
      expect(nodeClone.render()).toEqual('<li>my cloned item</li>')
    })
  
    it('without inheriting parent context', () => {
      const el = '<variable name="item">my item</variable><ul><li>{item}</li></ul>';
      const node = new HTMLNode(el, {
        customTags: {'variable': Variable}
      });
      const nodeClone = node.childNodes()[1].childNodes()[0].clone();
    
      expect(node.render()).toEqual('<ul><li>my item</li></ul>');
      expect(nodeClone.context).toEqual({})
      expect(() => nodeClone.render()).toThrowError('item is not defined')
    })
  });
  
  describe('should duplicate', () => {
    it('without context', () => {
      const el = '<li>item</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap});
      const nodeClone = node.duplicate();
    
      expect(node.render()).toEqual('<li>item</li>')
      expect(nodeClone.render()).toEqual('<li>item</li>')
    })
  
    it('with context', () => {
      const el = '<li>{item}</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap});
      node.setContext('item', 'my item')
      const nodeClone = node.duplicate();
      nodeClone.setContext('item', 'my cloned item')
    
      expect(node.render()).toEqual('<li>my item</li>')
      expect(nodeClone.render()).toEqual('<li>my cloned item</li>')
    })
  
    it('by passing context', () => {
      const el = '<li>{item}</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap});
      node.setContext('item', 'my item')
      const nodeClone = node.duplicate({
        item: 'my cloned item'
      });
    
      expect(node.render()).toEqual('<li>my item</li>')
      expect(nodeClone.render()).toEqual('<li>my cloned item</li>')
    })
  
    it('inheriting parent context', () => {
      const el = '<variable name="item">my item</variable><ul><li>{item}</li></ul>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap});
      const nodeClone = node.childNodes()[1].childNodes()[0].duplicate();
    
      expect(node.render()).toEqual('<ul><li>my item</li><li>my item</li></ul>');
      expect(nodeClone.context).toEqual({item: 'my item'})
      expect(nodeClone.render()).toEqual('<li>my item</li>')
    })
  });
});