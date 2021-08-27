const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Variable Tag', () => {
  beforeAll(() => {
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  describe('should create context data', () => {
    it('using name and value attributes ', () => {
      const str = '<variable name="test" value="20"></variable><b>{test}</b>';

      expect(render(str)).toEqual('<b>20</b>');
    });
  
    it('using name attribute and simple text', () => {
      const str = '<variable name="test">20</variable><b>{test}</b>';
  
      expect(render(str)).toEqual('<b>20</b>');
    });
  
    it('using name attribute and object content', () => {
      const str = '<variable name="docs">{{page1: "Page 1", page2: "Page 2"}}</variable>{docs}';
    
      expect(render(str)).toEqual('[object Object]');
    });
  
    it('for all sibling nodes after', () => {
      const str = '<variable name="title">Super Title</variable>' +
        '<div><p>{title}</p></div>'
      ;
    
      expect(render(str)).toEqual('<div><p>Super Title</p></div>');
    });
  
    it('handle complex value logic', () => {
    
      expect(render({
        content: '<variable name="item" value="list.find((item, i) => i === 2)"></variable>{item.name}',
        context: {
          list: [{name: 'a'}, {name: 'b'}, {name: 'c'}]
        }
      })).toEqual('c');
    });
  
    it('overriding data', () => {
      const str = '<variable name="sample" value="`rendered`"></variable>{sample}';
    
      expect(render(str, {
        context: {
          sample: 'render'
        }
      })).toEqual('rendered');
    });
  
    it('overriding other variable', () => {
      const str = '<variable name="sample" value="\'rendered\'"></variable>{sample}' +
        '<div><variable name="sample" value="\'rendered again\'"></variable>{sample}</div>'
      ;
    
      expect(render(str, {
        context: {
          sample: 'render'
        }
      })).toEqual('rendered<div>rendered again</div>');
    });
  });
  
  describe('should throw an error', () => {
    it('when access data outside the scope', () => {
      const str = '{sample}<variable name="test" value="20"></variable>';
  
      expect(() => render(str)).toThrowError('sample is not defined');
    });
  
    it('if name not provided', () => {
      const str = '<variable></variable>';
      
      expect(() => render(str)).toThrowError('Variable must have a name');
    });
  
    it('if provided name is empty', () => {
      const str = '<variable name=""></variable>';
    
      expect(() => render(str)).toThrowError('Variable must have a name');
    });
    
    it('if provided name is invalid', () => {
      const str = '<variable name="09dd"></variable>';
  
      expect(() => render(str)).toThrowError('Invalid variable name "09dd"');
    });
    
    it('if children is a html tag', () => {
      const str = '<variable name="test"><b>20</b></variable>';
      
      expect(() => render(str)).toThrowError('Variable children cannot be HTML tags');
    });
  });
  
});
