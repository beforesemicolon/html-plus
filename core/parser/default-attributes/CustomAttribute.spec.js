const {CustomAttribute} = require('./CustomAttribute');

describe('CustomAttribute', () => {
  it('should create', () => {
    const attr = new CustomAttribute();
    
    expect(attr.execute).toBe(false);
    expect(attr.process('val')).toBe('val');
    expect(attr.render('val', {})).toEqual({});
  });
});
