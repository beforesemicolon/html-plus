const {transform} = require('../transform');

describe('Variable Tag', () => {
  describe('should create context data', () => {
    it('using name and value attributes ', () => {
      const str = '<variable name="test" value="20"></variable><b>{test}</b>';

      expect(transform(str)).toEqual('<b>20</b>');
    });
  
    it('using name attribute and children text', () => {
      const str = '<variable name="test">20</variable><b>{test}</b>';
  
      expect(transform(str)).toEqual('<b>20</b>');
    });
  
    it('using name attribute and children text', () => {
      const str = '<variable name="docs">{{page1: "Page 1", page2: "Page 2"}}</variable>';
    
      expect(transform(str)).toEqual('');
    });
  
    it('for all sibling nodes after', () => {
      const str = '<variable name="title">Super Title</variable>' +
        '<div><p>{title}</p></div>'
      ;
    
      expect(transform(str)).toEqual('<div><p>Super Title</p></div>');
    });
  
    it('handle complex value logic', () => {
      const str = '<variable name="item" value="$data.list.find((item, i) => i === 2)"></variable>{item.name}';
    
      expect(transform(str, {
        data: {
          list: [{name: 'a'}, {name: 'b'}, {name: 'c'}]
        }
      })).toEqual('c');
    });
  
    it('overriding data', () => {
      const str = '<variable name="sample" value="`transformed`"></variable>{sample}';
    
      expect(transform(str, {
        data: {
          sample: 'transform'
        }
      })).toEqual('transformed');
    });
  
    it('overriding other variable', () => {
      const str = '<variable name="sample" value="\'transformed\'"></variable>{sample}' +
        '<div><variable name="sample" value="\'transformed again\'"></variable>{sample}</div>'
      ;
    
      expect(transform(str, {
        data: {
          sample: 'transform'
        }
      })).toEqual('transformed<div>transformed again</div>');
    });
  });
  
  describe('should throw an error', () => {
    it('when access data outside the scope', () => {
      const str = '{test}<variable name="test" value="20"></variable>';
  
      expect(() => transform(str)).toThrowError('test is not defined');
    });
  
    it('if name not provided', () => {
      const str = '<variable></variable>';
      
      expect(() => transform(str)).toThrowError('Variable must have a name');
    });
  
    it('if provided name is empty', () => {
      const str = '<variable name=""></variable>';
    
      expect(() => transform(str)).toThrowError('Variable must have a name');
    });
    
    it('if provided name is invalid', () => {
      const str = '<variable name="09dd"></variable>';
  
      expect(() => transform(str)).toThrowError('Invalid variable name "09dd"');
    });
    
    it('if children is a html tag', () => {
      const str = '<variable name="test"><b>20</b></variable>';
      
      expect(() => transform(str)).toThrowError('Variable children cannot be HTML tags');
    });
  });
  
});