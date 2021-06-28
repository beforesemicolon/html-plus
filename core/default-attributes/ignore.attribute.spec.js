const {transform} = require('./../transform');

describe('Ignore Attribute', () => {
  describe('should not bind data', () => {
    it('when no value', () => {
      const str = '<div #ignore><b>{sample}</b></div>'
  
      expect(transform(str)).toEqual('<div><b>{sample}</b></div>');
    });
  
    it('with value', () => {
      const str = '<div #ignore="$data.content"><b>{sample}</b></div>'
    
      expect(transform(str, {
        data: {
          content: '<p>Sample</p>'
        }
      })).toEqual('<div><b>{sample}</b><p>Sample</p></div>');
    });
  });
  
  it('should escape html', () => {
    const str = '<div #ignore escape><b>{sample}</b></div>'
    
    expect(transform(str, {
      data: {
        content: '<p>Sample</p>'
      }
    })).toEqual('<div>&lt;b&gt;{sample}&lt;/b&gt;</div>');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', () => {
      expect(transform('<b #ignore #repeat="3">{$item}</b>'))
        .toEqual('<b>{$item}</b><b>{$item}</b><b>{$item}</b>');
    });
  
    it('fragment', () => {
      expect(transform('<b #ignore #fragment>{item}</b>')).toEqual('<b>{item}</b>');
    });
  
    it('if', () => {
      expect(transform('<b #if="false" #ignore>{item}</b>')).toEqual('');
      expect(transform('<b #if="true" #ignore>{item}</b>')).toEqual('<b>{item}</b>');
    });
    
    it('attr', () => {
      expect(transform('<b #attr="class, cls, true" #ignore>{item}</b>'))
        .toEqual('<b class="cls">{item}</b>');
    });
  });
});