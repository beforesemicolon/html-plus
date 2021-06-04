const {processNodeAttributes} = require('./process-node-attributes');

describe('processNodeAttributes', () => {
  it('should return empty object without any argument', () => {
    expect(processNodeAttributes()).toEqual({})
  });
  
  it('should return intact attributes if no bind curly braces or if attributes are not special', () => {
    expect(processNodeAttributes({name: 'test', value: 'good'})).toEqual({name: 'test', value: 'good'})
  });
  
  it('should turn dash separated attributes into camelcase', () => {
    expect(processNodeAttributes({'name-attr': 'test', 'value-attr': 'good'})).toEqual({nameAttr: 'test', valueAttr: 'good'})
  });
  
  it('should turn boolean and numbers attribute values into booleans and numbers', () => {
    expect(processNodeAttributes({valid: 'true', value: '12'})).toEqual({valid: true, value: 12})
  });
  
  it('should bind attributes if value are marked for bind', () => {
    expect(processNodeAttributes({valid: '{valid}', value: '{value}'}, {}, {valid: true, value: 12})).toEqual({valid: true, value: 12})
  });
  
  describe('should resolve special attributes', () => {
    it('by binding', () => {
      expect(processNodeAttributes({valid: 'valid', value: 'value'}, {
        valid: {bind: true},
        value: {bind: true}
      }, {valid: true, value: 12})).toEqual({valid: true, value: 12})
    });
    
    it('by processing', () => {
      expect(processNodeAttributes({valid: 'valid', value: 'value'}, {
        valid: {process: val => !val},
        value: {bind: true, process: val => val * 10}
      }, {valid: true, value: 12})).toEqual({valid: false, value: 120})
    });
  });
  
  it('should throw error if data missing data', () => {
    expect(() => processNodeAttributes({valid: '{valid}', value: '{value}'}, )).toThrowError('Failed to process attribute "valid": valid is not defined')
  });
  
});