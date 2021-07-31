const {transform} = require('./../transform');

describe('Ignore Tag', () => {
  describe('should not bind data', () => {
    it('when no value', async () => {
      const str = '<ignore><b>{sample}</b></div>'
      
      await expect(transform(str)).resolves.toEqual('<b>{sample}</b>');
    });
    
    it('with value', async () => {
      const str = '<ignore value="$data.content"><b>{sample}</b></ignore>'
      
      await expect(transform(str, {
        data: {
          content: '<p>Sample</p>'
        }
      })).resolves.toEqual('<b>{sample}</b><p>Sample</p>');
    });
  });
  
  it('should escape html', async () => {
    const str = '<ignore escape><b>{sample}</b></div>'
    
    await expect(transform(str, {
      data: {
        content: '<p>Sample</p>'
      }
    })).resolves.toEqual('&lt;b&gt;{sample}&lt;/b&gt;');
  });
});
