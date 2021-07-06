const {Attribute} = require('./Attribute');

describe('Attribute', () => {
  it('should create', () => {
    const attr = new Attribute();
    
    expect(attr.execute).toBe(false);
    expect(attr.bind).toBe(false);
    expect(attr.process('val')).toBe('val');
    expect(attr.render('val', {})).toEqual({});
  });
});