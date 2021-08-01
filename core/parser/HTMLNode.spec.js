const {defaultAttributesMap} = require("../default-attributes");
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
    expect(node.type).toEqual('node');
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
      expect(node.render()).toEqual('<ul class="list-items"><li class="item">item 1</li><li class="item">item 2</li><li class="item">item 3</li></ul>');
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
  
      return expect(node.render()).toEqual('<title><h5>My title</h5></title>');
    });
    
    it('from function', () => {
      htmlNode.setAttribute('type', 'm')
      const node = new HTMLNode(htmlNode, {customTags: {'title': title}});

      return expect(node.render()).toEqual('<title><h4>My title</h4></title>');
    });
  });
  
  describe('should handle custom attributes', () => {
    it.todo('from class')
    
    it.todo('from function')
  });
  
  describe('should clone', () => {
    it('without context', () => {
      const el = '<li>item</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap, defaultTags: defaultTagsMap});
      const nodeClone = node.clone();
      
      expect(node.render()).toEqual('<li>item</li>')
      expect(nodeClone.render()).toEqual('<li>item</li>')
    })
  
    it('with context', () => {
      const el = '<li>{item}</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap, defaultTags: defaultTagsMap});
      node.setContext('item', 'my item')
      const nodeClone = node.clone();
      nodeClone.setContext('item', 'my cloned item')
    
      expect(node.render()).toEqual('<li>my item</li>')
      expect(nodeClone.render()).toEqual('<li>my cloned item</li>')
    })
  
    it('without inheriting parent context', () => {
      const el = '<variable name="item">my item</variable><ul><li>{item}</li></ul>';
      const node = new HTMLNode(el, {
        customTags: {'variable': Variable}, defaultTags: defaultTagsMap
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
      const node = new HTMLNode(el, {customTags: defaultTagsMap, defaultTags: defaultTagsMap});
      const nodeClone = node.duplicate();
    
      expect(node.render()).toEqual('<li>item</li>')
      expect(nodeClone.render()).toEqual('<li>item</li>')
    })
  
    it('with context', () => {
      const el = '<li>{item}</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap, defaultTags: defaultTagsMap});
      node.setContext('item', 'my item')
      const nodeClone = node.duplicate();
      nodeClone.setContext('item', 'my cloned item')
    
      expect(node.render()).toEqual('<li>my item</li>')
      expect(nodeClone.render()).toEqual('<li>my cloned item</li>')
    })
  
    it('by passing context', () => {
      const el = '<li>{item}</li>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap, defaultTags: defaultTagsMap});
      node.setContext('item', 'my item')
      const nodeClone = node.duplicate({
        item: 'my cloned item'
      });
    
      expect(node.render()).toEqual('<li>my item</li>')
      expect(nodeClone.render()).toEqual('<li>my cloned item</li>')
    })
  
    it('inheriting parent context', () => {
      const el = '<variable name="item">my item</variable><ul><li>{item}</li></ul>';
      const node = new HTMLNode(el, {customTags: defaultTagsMap, defaultTags: defaultTagsMap});
      const nodeClone = node.childNodes()[1].childNodes()[0].duplicate();
    
      expect(node.render()).toEqual('<ul><li>my item</li><li>my item</li></ul>');
      expect(nodeClone.context).toEqual({item: 'my item'})
      expect(nodeClone.render()).toEqual('<li>my item</li>')
    })
  });
  
  describe('context', () => {
    it('should update', () => {
      const node = (new HTMLNode('<h1 id="site-logo">{title}</h1>')).childNodes()[0];
      node.setContext('title', 'some title')
      
      expect(node.context.title).toEqual('some title');
      expect(node.toString()).toEqual('<h1 id="site-logo">some title</h1>');
  
      node.setContext('title', 'cool title')
  
      expect(node.context.title).toEqual('cool title');
      expect(node.toString()).toEqual('<h1 id="site-logo">cool title</h1>');
    });
  
    it('should remove', () => {
      const node = (new HTMLNode('<h1 id="site-logo">{title}</h1>')).childNodes()[0];
      node.setContext('title', 'some title')
    
      expect(node.context.title).toEqual('some title');
      expect(node.toString()).toEqual('<h1 id="site-logo">some title</h1>');
    
      node.removeContext('title')
    
      expect(node.context.title).toBeUndefined();
      expect(() => node.toString()).toThrowError('title is not defined');
    });
  });
  
  describe('attributes', () => {
    it('should update', () => {
      const node = (new HTMLNode('<h1 id="site-logo">some title</h1>')).childNodes()[0];
      
      expect(node.attributes.id).toEqual('site-logo');
      expect(node.toString()).toEqual('<h1 id="site-logo">some title</h1>');
  
      node.setAttribute('id', 'logo');
  
      expect(node.attributes.id).toEqual('logo');
      expect(node.toString()).toEqual('<h1 id="logo">some title</h1>');
    });
    
    it('should remove', () => {
      const node = (new HTMLNode('<h1 id="site-logo">some title</h1>')).childNodes()[0];
  
      expect(node.attributes.id).toEqual('site-logo');
      expect(node.toString()).toEqual('<h1 id="site-logo">some title</h1>');
  
      node.removeAttribute('id');
  
      expect(node.attributes.id).toBeUndefined();
      expect(node.toString()).toEqual('<h1>some title</h1>');
    });
  });
  
  describe('should render', () => {
    it('with render method', () => {
      const node1 = new HTMLNode('<h1 id="sample">some title</h1>');
      const node2 = new HTMLNode('<p>{$data.x > 5}</h1>', {data: {x: 3}});
      const node3 = new HTMLNode('<ul><li #repeat="3">{$item >= 2}</li></ul>', {customAttributes: defaultAttributesMap});
  
      expect(node1.childNodes()[0].render())
        .toEqual('<h1 id="sample">some title</h1>')
      expect(node2.childNodes()[0].render())
        .toEqual('<p>false</p>')
      expect(node3.childNodes()[0].render())
        .toEqual('<ul><li>false</li><li>true</li><li>true</li></ul>')
    });
    
    it('with toString method', () => {
      const node1 = new HTMLNode('<h1 id="sample">some title</h1>');
      const node2 = new HTMLNode('<p>{$data.x > 5}</h1>', {data: {x: 3}});
      const node3 = new HTMLNode('<ul><li #repeat="3">{$item >= 2}</li></ul>', {customAttributes: defaultAttributesMap});
  
      expect(node1.childNodes()[0].toString())
        .toEqual('<h1 id="sample">some title</h1>')
      expect(node2.childNodes()[0].toString())
        .toEqual('<p>false</p>')
      expect(node3.childNodes()[0].toString())
        .toEqual('<ul><li>false</li><li>true</li><li>true</li></ul>')
    });
    
    it('with renderChildren', () => {
      const node1 = new HTMLNode('<h1 id="sample">some title</h1>');
      const node2 = new HTMLNode('<p>{$data.x > 5}</h1>', {data: {x: 3}});
      const node3 = new HTMLNode('<ul><li #repeat="3">{$item >= 2}</li></ul>', {customAttributes: defaultAttributesMap});
  
      expect(node1.toString())
        .toEqual('<h1 id="sample">some title</h1>')
      expect(node2.toString())
        .toEqual('<p>false</p>')
      expect(node3.toString())
        .toEqual('<ul><li>false</li><li>true</li><li>true</li></ul>')
    });
  });
  
  describe('should get child nodes', () => {
    it('with context', () => {
      const node = new HTMLNode('<ul><li #repeat="x">item {$item}</li></ul>', {customAttributes: defaultAttributesMap});
      
      expect(node.childNodes()[0].childNodes({x: 3})).toEqual(expect.arrayContaining([
        {"attributes": {"repeat": "x"}}
      ]))
    });
  
    it('without context', () => {
      const node = new HTMLNode('<ul><li #repeat="x">item {$item}</li></ul>', {customAttributes: defaultAttributesMap});
    
      expect(node.childNodes()[0].childNodes()).toEqual(expect.arrayContaining([
        {"attributes": {"repeat": "x"}}
      ]))
    });
  });
  
  describe('should get', () => {
    it('raw attributes', () => {
      const node1 = new HTMLNode('<meta name="viewport" content="width=device-width initial-scale=1.0, minimum-scale=1.0">');
      const node2 = new HTMLNode('<h1 id="sample">some title</h1>');
      const node3 = new HTMLNode('<h1>some title</h1>');
      
      expect(node1.childNodes()[0].rawAttributes)
        .toEqual('name="viewport" content="width=device-width initial-scale=1.0, minimum-scale=1.0"')
      expect(node2.childNodes()[0].rawAttributes)
        .toEqual('id="sample"')
      expect(node3.childNodes()[0].rawAttributes)
        .toEqual('')
    });
    
    it('inner html', () => {
      const node1 = new HTMLNode('<h1 id="sample">some title</h1>');
      const node2 = new HTMLNode('<p>{x > 5}</h1>');
      const node3 = new HTMLNode('<ul><li #repeat="3">{$item <= 0}</li></ul>');
  
      expect(node1.childNodes()[0].innerHTML)
        .toEqual('some title')
      expect(node2.childNodes()[0].innerHTML)
        .toEqual('{x > 5}')
      expect(node3.childNodes()[0].innerHTML)
        .toEqual('<li #repeat="3">{$item <= 0}</li>')
    });
  });
  
  it('should keep comments', () => {
    const node = new HTMLNode('<!-- cant access "page" before declaration  -->');
    
    expect(node.innerHTML).toEqual('<!-- cant access "page" before declaration  -->')
  });
  
  it('should throw error for a specific tag where it failed', () => {
    const node = new HTMLNode(`
      <div class="list"><ul><li #repeat="3">item {x + $item}</li></div>
    `);
  
    try {
      node.render()
    } catch(e) {
      expect(e.message.includes('x is not defined')).toBeTruthy()
      expect(e.message.includes('item {x + $item} <= Error: x is not defined')).toBeTruthy()
    }
  });
});
