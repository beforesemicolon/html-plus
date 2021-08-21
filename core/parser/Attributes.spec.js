const {Attributes} = require('./Attributes');
const {Attr} = require('./Attr');

describe('Attributes', () => {
  const attributes = new Attributes('#if="shouldShow" href="sample/path" download');
  
  it('should set', () => {
    expect(attributes.toString()).toBe('#if="shouldShow" href="sample/path" download')
  });
  
  it('should be iterable', () => {
    const testCases = [
      ['#if', 'shouldShow'],
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
    expect(attributes.getNamedItem('#if')).toBeInstanceOf(Attr);
    expect(attributes.getNamedItem('download').value).toEqual(null);
    expect(attributes.getNamedItem('href').value).toEqual('sample/path');
  });
  
  it('should remove repeated attribute', () => {
    const attr = new Attributes('class="one" class="two"');
    const cls = attr.getNamedItem('class');
    const fn = jest.fn();
    
    [...attr].forEach(fn);
  
    expect(attr.length).toBe(1);
    expect(cls.value).toBe('one');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(attr.toString()).toBe('class="one"');
  
    fn.mockRestore();
  });
  
  it('should not render special attributes', () => {
    const attr = new Attributes('class="one" #if="logic" #repeat="3" id="sample"');
  
    expect(attr.toString()).toBe('class="one" #if="logic" #repeat="3" id="sample"');
  });
});
