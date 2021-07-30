const {transform} = require('./../transform');

describe('Ignore Attribute', () => {
  describe('should not bind data', () => {
    it('when no value', async () => {
      const str = '<div #ignore><b>{sample}</b></div>'
  
      await expect(transform(str)).resolves.toEqual('<div><b>{sample}</b></div>');
    });
  
    it('with value', async () => {
      const str = '<div #ignore="$data.content"><b>{sample}</b></div>'
    
      await expect(transform(str, {
        data: {
          content: '<p>Sample</p>'
        }
      })).resolves.toEqual('<div><b>{sample}</b><p>Sample</p></div>');
    });
  });
  
  it('should escape html', async () => {
    const str = '<div #ignore escape><b>{sample}</b></div>'
    
    await expect(transform(str, {
      data: {
        content: '<p>Sample</p>'
      }
    })).resolves.toEqual('<div>&lt;b&gt;{sample}&lt;/b&gt;</div>');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', async () => {
      await expect(transform('<b #ignore #repeat="3">{$item}</b>'))
        .resolves.toEqual('<b>{$item}</b><b>{$item}</b><b>{$item}</b>');
    });
  
    it('fragment', async () => {
      await expect(transform('<b #ignore #fragment>{item}</b>')).resolves.toEqual('<b>{item}</b>');
    });
  
    it('if', async () => {
      await expect(transform('<b #if="false" #ignore>{item}</b>')).resolves.toEqual('');
      await expect(transform('<b #if="true" #ignore>{item}</b>')).resolves.toEqual('<b>{item}</b>');
    });
    
    it('attr', async () => {
      await expect(transform('<b #attr="class, cls, true" #ignore>{item}</b>'))
        .resolves.toEqual('<b class="cls">{item}</b>');
    });
  });
});
