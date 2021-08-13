const {Attributes} = require('./Attributes');
const {Attr} = require('./Attr');

describe('Attributes', () => {
  const attributes = new Attributes('#if="shouldShow" href="sample/path" download');
  
  it('should set', () => {
    expect(attributes.toString()).toBe('#if="shouldShow" href="sample/path" download')
  });
  
  it('should be iterable', () => {
    const testCases = [
      ['if', 'shouldShow'],
      ['href', 'sample/path'],
      ['download', null],
    ];
  
    let i = 0;
    for (let attr of attributes) {
      expect(attr).toBeInstanceOf(Attr);
      expect(attr.name).toBe(testCases[i][0]);
      expect(attr.value).toBe(testCases[i][1]);
      i += 1;
    }
  });
  
  it('should get length', () => {
    expect(attributes.length).toBe(3)
  });
  
  it('should get attribute by name', () => {
    expect(attributes.getNamedItem('if')).toBeInstanceOf(Attr);
    expect(attributes.getNamedItem('download').value).toEqual(null);
    expect(attributes.getNamedItem('href').value).toEqual('sample/path');
  });
});
