const {transform} = require('../transform');

describe('Variable Tag', () => {
  describe('should create context data', () => {
    it('using name and value attributes ', async () => {
      const str = '<variable name="test" value="20"></variable><b>{test}</b>';

      await expect(transform(str)).resolves.toEqual('<b>20</b>');
    });
  
    it('using name attribute and children text', async () => {
      const str = '<variable name="test">20</variable><b>{test}</b>';
  
      await expect(transform(str)).resolves.toEqual('<b>20</b>');
    });
  
    it('using name attribute and children text', async () => {
      const str = '<variable name="docs">{{page1: "Page 1", page2: "Page 2"}}</variable>{docs}';
    
      await expect(transform(str)).resolves.toEqual('[object Object]');
    });
  
    it('for all sibling nodes after', async () => {
      const str = '<variable name="title">Super Title</variable>' +
        '<div><p>{title}</p></div>'
      ;
    
      await expect(transform(str)).resolves.toEqual('<div><p>Super Title</p></div>');
    });
  
    it('handle complex value logic', async () => {
      const str = '<variable name="item" value="$data.list.find((item, i) => i === 2)"></variable>{item.name}';
    
      await expect(transform(str, {
        data: {
          list: [{name: 'a'}, {name: 'b'}, {name: 'c'}]
        }
      })).resolves.toEqual('c');
    });
  
    it('overriding data', async () => {
      const str = '<variable name="sample" value="`transformed`"></variable>{sample}';
    
      await expect(transform(str, {
        data: {
          sample: 'transform'
        }
      })).resolves.toEqual('transformed');
    });
  
    it('overriding other variable', async () => {
      const str = '<variable name="sample" value="\'transformed\'"></variable>{sample}' +
        '<div><variable name="sample" value="\'transformed again\'"></variable>{sample}</div>'
      ;
    
      await expect(transform(str, {
        data: {
          sample: 'transform'
        }
      })).resolves.toEqual('transformed<div>transformed again</div>');
    });
  });
  
  describe('should throw an error', () => {
    it('when access data outside the scope', async () => {
      const str = '{test}<variable name="test" value="20"></variable>';
  
      await expect(transform(str)).rejects.toThrowError('test is not defined');
    });
  
    it('if name not provided', async () => {
      const str = '<variable></variable>';
      
      await expect(transform(str)).rejects.toThrowError('Variable must have a name');
    });
  
    it('if provided name is empty', async () => {
      const str = '<variable name=""></variable>';
    
      await expect(transform(str)).rejects.toThrowError('Variable must have a name');
    });
    
    it('if provided name is invalid', async () => {
      const str = '<variable name="09dd"></variable>';
  
      await expect(transform(str)).rejects.toThrowError('Invalid variable name "09dd"');
    });
    
    it('if children is a html tag', async () => {
      const str = '<variable name="test"><b>20</b></variable>';
      
      await expect(transform(str)).rejects.toThrowError('Variable children cannot be HTML tags');
    });
  });
  
});
