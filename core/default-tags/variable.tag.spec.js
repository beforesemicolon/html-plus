const {transform} = require('../transform');

describe('Variable', () => {
  describe('should create context data', () => {
    it('using name and value attributes ', async () => {
      const str = '<variable name="test" value="20"></variable><b>{test}</b>';

      await expect(transform(str)).resolves.toEqual('<b>20</b>');
    });
  
    it('using name attribute and children text', async () => {
      const str = '<variable name="test">20</variable><b>{test}</b>';
  
      await expect(transform(str)).resolves.toEqual('<b>20</b>');
    });
  });
  
  describe('should throw an error', () => {
    it('when access data outside the scope', async () => {
      const str = '{test}<variable name="test" value="20"></variable>';
  
      await expect(() => transform(str)).rejects.toThrowError('test is not defined');
    });
  
    it('if name not provided', async () => {
      const str = '<variable></variable>';
      
      await expect(() => transform(str)).rejects.toThrowError('Variable must have a name');
    });
  
    it('if provided name is empty', async () => {
      const str = '<variable name=""></variable>';
    
      await expect(() => transform(str)).rejects.toThrowError('Variable must have a name');
    });
    
    it('if provided name is invalid', async () => {
      const str = '<variable name="09dd"></variable>';
  
      await expect(() => transform(str)).rejects.toThrowError('Invalid variable name "09dd"');
    });
    
    it('if value attribute is not provided', async () => {
      const str = '<variable name="test"></variable>';
      
      await expect(() => transform(str)).rejects.toThrowError('Variable name "test" is missing value');
    });
    
    it('if value attribute is empty', async () => {
      const str = '<variable name="test" value=""></variable>';
      
      await expect(() => transform(str)).rejects.toThrowError('Variable name "test" is missing value');
    });
    
    it('if children is a html tag', async () => {
      const str = '<variable name="test"><b>20</b></variable>';
      
      await expect(() => transform(str)).rejects.toThrowError('Variable children cannot be HTML tags');
    });
  });
  
});